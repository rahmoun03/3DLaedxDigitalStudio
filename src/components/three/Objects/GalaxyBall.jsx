import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'

export default function GalaxyBall({ color = '#3ae1ff', radius = 1.2 }) {
  const matRef = useRef(null)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) },
    uRimPower: { value: 0.2 },
    uRingWidth: { value: 0.1 },
    uNoiseScale: { value: 1.0 },
    uNoiseSpeed: { value: 0.4 },
    uNoiseAmp: { value: 0.7 },
    uCrackleStrength: { value: 2.5 }
  }), [color])

  useFrame((_, dt) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += dt
    }
  })

  return (
    <mesh position={[0, 1.3, 0]} >
      <sphereGeometry args={[radius, 192, 192]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
/* ---------- GLSL ---------- */

const vertex = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldPos = world.xyz;
    vec4 view = viewMatrix * world;
    vViewDir = normalize(-view.xyz);

    gl_Position = projectionMatrix * view;
  }
`;

// 3D simplex noise (small, fast)
const fragment = /* glsl */ `
  precision highp float;

  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  uniform float uTime;
  uniform vec3  uColor;
  uniform float uRimPower;
  uniform float uRingWidth;
  uniform float uNoiseScale;
  uniform float uNoiseSpeed;
  uniform float uNoiseAmp;
  uniform float uCrackleStrength;

  // --- simplex noise by iq (trimmed) ---
  vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
  vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    //  x0 = x0 - 0. + 0.0 * C
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1. + 3.0 * C.xxx;

    // Permutations
    i = mod289(i);
    vec4 p = permute( permute( permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    // Gradients
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  // mod(p,7*7)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a1.xy,h.y);
    vec3 p2 = vec3(a0.zw,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    // Normalize gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  float fbm(vec3 p){
    float f = 0.0;
    float a = 0.5;
    for (int i=0; i<5; i++){
      f += a * snoise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return f;
  }

  void main(){
    // Fresnel rim for "edge glow"
    float fresnel = pow(1.0 - dot(normalize(vNormal), normalize(vViewDir)), uRimPower);

    // Make it a ring: only keep a band of Fresnel
    float inner = 0.5;                // where the dark core starts
    float outer = clamp(inner + uRingWidth, 0.0, 1.0);
    float ring  = smoothstep(inner, outer, fresnel) * (1.0 - smoothstep(outer, 1.0, fresnel));

    // Animated noise for crackle along the rim
    vec3 p = vWorldPos * uNoiseScale + vec3(0.0, 0.0, uTime * uNoiseSpeed);
    float n = fbm(p);                 // [-1,1]ish
    n = 0.5 + 0.5 * n;                // [0,1]

    // Thin lightning veins using derivative-based edge detection
    float veins = smoothstep(0.48, 0.5, abs(n - 0.5));
    float veinEdges = smoothstep(0.0, 2.0, fwidth(n)); // anti-aliased
    float crackle = (1.0 - veins) * (1.0 - veinEdges);

    // Final brightness: rim + noisy boost + sharp crackle
    float glow = ring * (0.6 + uNoiseAmp * n + uCrackleStrength * crackle);

    vec3 col = uColor * glow;

    // Additive, but keep alpha for compositing
    gl_FragColor = vec4(col, clamp(glow, 0.0, 1.0));
  }
`;
