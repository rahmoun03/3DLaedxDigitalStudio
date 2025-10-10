// SupernovaExplosion.jsx
import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";

/*
  Usage:
    <Canvas camera={{ position: [0,0,5], fov: 45 }}>
      <SupernovaExplosion
         channel0={yourTexture0}
         channel1={yourLUTTexture}
         channel2={yourNoiseTexture}
         resolution={[width, height]}
      />
    </Canvas>
*/

function createRandomDataTexture(width = 256, height = 1) {
  const size = width * height * 4;
  const data = new Uint8Array(size);
  for (let i = 0; i < size; i++) data[i] = Math.floor(Math.random() * 256);
  const tex = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  tex.needsUpdate = true;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform vec3 iResolution;
  uniform float iTime;
  uniform float iTimeDelta;
  uniform float iFrameRate;
  uniform int iFrame;
  uniform float iChannelTime[4];
  uniform vec3 iChannelResolution[4];
  uniform vec4 iMouse;
  uniform sampler2D iChannel0; // noise / lookup
  uniform sampler2D iChannel1; // LUT
  uniform sampler2D iChannel2; // dither texture
  uniform vec4 iDate;

  uniform float uDithering;
  uniform float uBackground;
  uniform float uToneMap;
  uniform float uSpeed;
  uniform float uScale;
  uniform vec2 uRotation; // x = rotate amount applied to R macro

  // -- reveal controls
  uniform float uProgress;      // 0.0 .. 1.0 (maps from your 0..100 prop)
  uniform float uRevealSteps;   // if >= 2, quantize progress in (uRevealSteps) steps
  uniform float uRevealRadius;  // world radius used for reveal mapping
  uniform float uRevealEdge;    // smooth edge width for reveal

  #define pi 3.14159265
  #define R(p, a) p = cos(a)*p + sin(a)*vec2(p.y, -p.x)

  float noise( in vec3 x )
  {
      vec3 p = floor(x);
      vec3 f = fract(x);
      f = f*f*(3.0-2.0*f);
      vec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;
      vec2 rg = texture2D( iChannel0, (uv+ 0.5)/256.0 ).yx;
      return 1. - 0.82*mix( rg.x, rg.y, f.z );
  }

  float fbm( vec3 p )
  {
     return noise(p*.06125)*.5 + noise(p*.125)*.25 + noise(p*.25)*.125 + noise(p*.4)*.2;
  }

  float Sphere( vec3 p, float r )
  {
      return length(p)-r;
  }

  const float nudge = 4.;
  float normalizer = 1.0 / 1.0;
  float SpiralNoiseC(vec3 p)
  {
      float n = 1. - mod(iTime * 0.1, -1.0);
      float iter = 2.0;
      for (int i = 0; i < 8; i++)
      {
          n += -abs(sin(p.y*iter) + cos(p.x*iter)) / iter;
          p.xy += vec2(p.y, -p.x) * nudge;
          p.xy *= 1.0 / sqrt(1.0 + nudge*nudge);
          p.xz += vec2(p.z, -p.x) * nudge;
          p.xz *= 1.0 / sqrt(1.0 + nudge*nudge);
          iter *= 1.733733;
      }
      return n;
  }

  float VolumetricExplosion(vec3 p)
  {
      float final = Sphere(p,4.);
      final += noise(p*20.)*.4;
      final += SpiralNoiseC(p.zxy*fbm(p*10.))*2.5;
      return final;
  }

  float map(vec3 p)
  {
      R(p.xz, iMouse.x*0.008*pi + iTime*0.1);
      float tmod = 1.0 + mod(iTime * 0.1, -1.0);
      float VolExplosion = VolumetricExplosion(p/(tmod))*(tmod);
      return abs(VolExplosion)+0.07;
  }

  vec3 computeColor( float density, float radius )
  {
      vec3 result = mix( vec3(1.0,0.9,0.8), vec3(0.4,0.15,0.1), density );
      vec3 colCenter = 7.0 * vec3(0.8,1.0,1.0);
      vec3 colEdge = 1.5 * vec3(0.48,0.53,0.5);
      result *= mix( colCenter, colEdge, min( (radius+0.05)/0.9, 1.15 ) );
      return result;
  }

  bool RaySphereIntersect(vec3 org, vec3 dir, out float near, out float far)
  {
      float b = dot(dir, org);
      float c = dot(org, org) - 8.0;
      float delta = b*b - c;
      if( delta < 0.0) return false;
      float deltasqrt = sqrt(delta);
      near = -b - deltasqrt;
      far = -b + deltasqrt;
      return far > 0.0;
  }

  vec3 ToneMapFilmicALU(vec3 _color)
  {
      _color = max(vec3(0), _color - vec3(0.004));
      _color = (_color * (6.2*_color + vec3(0.5))) / (_color * (6.2 * _color + vec3(1.7)) + vec3(0.06));
      return pow(_color, vec3(2.2));
  }

  void mainImage( out vec4 fragColor, in vec2 fragCoord )
  {
      // Apply reveal quantization if requested
      float prog = clamp(uProgress, 0.0, 1.0);
      if (uRevealSteps >= 2.0) {
        float n = max(2.0, uRevealSteps);
        prog = floor(prog * (n - 1.0) + 1e-6) / (n - 1.0);
      }

      const float KEY_1 = 49.5/256.0;
      const float KEY_2 = 50.5/256.0;
      const float KEY_3 = 51.5/256.0;
      float key = 0.0;
      key += 0.7*texture2D(iChannel1, vec2(KEY_1,0.25)).x;
      key += 0.7*texture2D(iChannel1, vec2(KEY_2,0.25)).x;
      key += 0.7*texture2D(iChannel1, vec2(KEY_3,0.25)).x;

      vec2 uv = fragCoord / iResolution.xy;

      vec3 rd = normalize(vec3((fragCoord.xy-0.5*iResolution.xy)/iResolution.y, 1.));
      vec3 ro = vec3(0., 0., -6. + key*1.6);

      float ld=0., td=0., w=0.;
      float d=1., t=0.;

      const float h = 0.1;
      vec4 sum = vec4(0.0);
      float min_dist=0.0, max_dist=0.0;

      if(RaySphereIntersect(ro, rd, min_dist, max_dist))
      {
          t = min_dist;
          for (int i=0; i<86; i++)
          {
              vec3 pos = ro + t*rd;
              if(td>0.9 || d<0.11*t || t>10. || sum.a > 0.99 || t>max_dist) break;
              float dlocal = map(pos);
              vec3 ldst = vec3(0.0)-pos;
              float lDist = max(length(ldst), 0.001);
              vec3 lightColor = vec3(1.0,0.5,0.25);
              sum.rgb += (vec3(0.67,0.75,1.00)/(lDist*lDist*15.0)/100.0);
              sum.rgb += (lightColor/exp(lDist*lDist*lDist*0.08)/30.0);

              if (dlocal < h)
              {
                  // ---- reveal mask (radial) ----
                  float rpos = length(pos); // distance from center
                  float threshold = prog * uRevealRadius;
                  // mask = 1.0 when inside threshold, 0.0 when outside, with smooth edge
                  float mask = 1.0 - smoothstep(threshold - uRevealEdge, threshold + uRevealEdge, rpos);
                  // if prog==0 mask==0 (no contribution)
                  // compute color and multiply by mask
                  ld = h - dlocal;
                  w = (1.0 - td) * ld;
                  td += w + 1.0/200.0;
                  vec4 col = vec4( computeColor(td, lDist), td );
                  col.a *= 0.2;
                  col.rgb *= col.a;
                  col.rgb *= mask;
                  col.a *= mask;
                  sum = sum + col*(1.0 - sum.a);
              }
              td += 1.0/70.0;

              if(uDithering > 0.5) {
                  vec2 uvd = uv;
                  uvd.y *= 120.0;
                  uvd.x *= 280.0;
                  dlocal = abs(dlocal) * (0.8 + 0.08 * texture2D(iChannel2, vec2(uvd.y, -uvd.x + 0.5 * sin(4.0*iTime + uvd.y*4.0))).r);
              }

              t += max(dlocal * 0.1 * max(min(length(ldst), length(ro)), 0.1), 0.01);
          }

          sum *= 1.0 / exp(ld * 0.2) * 0.8;
          sum = clamp(sum, 0.0, 1.0);
          sum.xyz = sum.xyz*sum.xyz*(3.0-2.0*sum.xyz);
      }

      if(uBackground > 0.5) {
          if (td < 0.8) {
              vec3 stars = vec3(noise(rd*500.0)*0.5+0.5);
              vec3 starbg = vec3(0.0);
              starbg = mix(starbg, vec3(0.8,0.9,1.0), smoothstep(0.99, 1.0, stars)*clamp(dot(vec3(0.0), rd) + 0.75, 0.0, 1.0));
              starbg = clamp(starbg, 0.0, 1.0);
              sum.xyz += starbg;
          }
      }

      vec3 outcol = sum.xyz;
      if(uToneMap > 0.5) outcol = ToneMapFilmicALU(outcol);

      // Final alpha: scale by progress so when prog = 0 the fragment is fully transparent
      float finalAlpha = clamp(sum.a * prog, 0.0, 1.0);
      fragColor = vec4(outcol, finalAlpha);
  }

  void main() {
    mainImage(gl_FragColor, vUv * iResolution.xy);
  }
`;

export default function SupernovaExplosion({
  channel0 = null,
  channel1 = null,
  channel2 = null,
  resolution = null,
  progress = 2, // 0..100
}) {
  const meshRef = useRef();
  const matRef = useRef();
  const { size } = useThree();

  // Leva controls (you can turn on reveal steps here)
  const {
    dither,
    background,
    tonemap,
    speed,
    scale,
    rotateX,
    revealSteps,
    revealRadius,
    revealEdge,
  } = useControls("Supernova", {
    dither: { value: true },
    background: { value: false },
    tonemap: { value: true },
    speed: { value: 1.25, min: 0.1, max: 4, step: 0.01 },
    scale: { value: 0.2, min: 0.1, max: 4.0, step: 0.01 },
    rotateX: { value: 0.0, min: -Math.PI, max: Math.PI, step: 0.001 },
    revealSteps: { value: 10, min: 0, max: 20, step: 1 },    // 0 = continuous, >=2 = discrete steps
    revealRadius: { value: 10.0, min: 0.5, max: 12.0, step: 0.05 },
    revealEdge: { value: 1.3, min: 0.0, max: 2.0, step: 0.01 },
  });

  // fallback textures
  const tex0 = useMemo(() => channel0 || createRandomDataTexture(256, 256), [channel0]);
  const tex1 = useMemo(() => channel1 || createRandomDataTexture(256, 1), [channel1]);
  const tex2 = useMemo(() => channel2 || createRandomDataTexture(128, 128), [channel2]);

  // attach initial textures / channel resolution
  useEffect(() => {
    if (!matRef.current) return;
    matRef.current.uniforms.iChannel0.value = tex0;
    matRef.current.uniforms.iChannel1.value = tex1;
    matRef.current.uniforms.iChannel2.value = tex2;
    matRef.current.uniforms.iChannelResolution.value = [
      new THREE.Vector3(tex0.image?.width || 256, tex0.image?.height || 256, 1),
      new THREE.Vector3(tex1.image?.width || 256, tex1.image?.height || 1, 1),
      new THREE.Vector3(tex2.image?.width || 128, tex2.image?.height || 128, 1),
      new THREE.Vector3(1,1,1),
    ];
  }, [tex0, tex1, tex2]);

  // uniforms (include reveal uniforms)
  const uniforms = useMemo(() => ({
    iResolution: { value: new THREE.Vector3(size.width, size.height, 1) },
    iTime: { value: 0.0 },
    iTimeDelta: { value: 0.0 },
    iFrameRate: { value: 0.0 },
    iFrame: { value: 0 },
    iChannelTime: { value: [0.0, 0.0, 0.0, 0.0] },
    iChannelResolution: { value: [new THREE.Vector3(256,256,1), new THREE.Vector3(256,1,1), new THREE.Vector3(128,128,1), new THREE.Vector3(1,1,1)] },
    iMouse: { value: new THREE.Vector4(0,0,0,0) },
    iChannel0: { value: tex0 },
    iChannel1: { value: tex1 },
    iChannel2: { value: tex2 },
    iDate: { value: new THREE.Vector4(2025,1,1,0) },

    // runtime toggles
    uDithering: { value: dither ? 1.0 : 0.0 },
    uBackground: { value: background ? 1.0 : 0.0 },
    uToneMap: { value: tonemap ? 1.0 : 0.0 },
    uSpeed: { value: speed },
    uScale: { value: scale },
    uRotation: { value: new THREE.Vector2(0,0) },

    // reveal uniforms
    uProgress: { value: 0.0 },
    uRevealSteps: { value: revealSteps },
    uRevealRadius: { value: revealRadius },
    uRevealEdge: { value: revealEdge },
  }), [size, tex0, tex1, tex2, dither, background, tonemap, speed, scale, revealSteps, revealRadius, revealEdge]);

  // update per-frame
  useFrame((state, delta) => {
    if (!matRef.current) return;
    const now = performance.now() / 1000;
    const u = matRef.current.uniforms;

    // Map external progress (0..100) -> 0..1
    const pClamped = Math.max(0, Math.min(100, progress));
    const prog01 = pClamped / 100.0;

    // iTime still used for noise/time-driven elements, but we drive main animation visually with uProgress.
    u.iTime.value = now * speed;
    u.iTimeDelta.value = delta;
    u.iFrameRate.value = 1.0 / Math.max(1e-6, delta);
    u.iFrame.value += 1;
    const ft = u.iChannelTime.value;
    ft[0] += delta;
    u.iChannelTime.value = ft;

    // resolution (respect optional explicit resolution prop)
    const w = resolution ? resolution[0] : size.width;
    const h = resolution ? resolution[1] : size.height;
    u.iResolution.value.set(w * scale, h * scale, 1.0);

    // date/uniform toggles
    const d = new Date();
    u.iDate.value.set(d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours()*3600 + d.getMinutes()*60 + d.getSeconds());
    u.uDithering.value = dither ? 1.0 : 0.0;
    u.uBackground.value = background ? 1.0 : 0.0;
    u.uToneMap.value = tonemap ? 1.0 : 0.0;
    u.uSpeed.value = speed;
    u.uScale.value = scale;
    u.uRotation.value.set(rotateX, 0);

    // reveal uniforms: quantize in JS side (keeps shader simpler)
    let progQuant = prog01;
    if (revealSteps >= 2) {
      const n = Math.max(2, revealSteps);
      progQuant = Math.floor(prog01 * (n - 1) + 1e-6) / (n - 1);
    }
    u.uProgress.value = progQuant;
    u.uRevealSteps.value = revealSteps;
    u.uRevealRadius.value = revealRadius;
    u.uRevealEdge.value = revealEdge;

    // Ensure textures refresh if generated
    tex0.needsUpdate = true;
    tex1.needsUpdate = true;
    tex2.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} position={[0, 1.3, 0]}>
      <planeGeometry args={[8 * (size.width/size.height), 8, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={true}
        transparent={true}
      />
    </mesh>
  );
}
