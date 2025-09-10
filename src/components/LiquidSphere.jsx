import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function LiquidSphere() {
  const meshRef = useRef();

  const uniforms = useRef({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color("#ED8C00") }, // Cyan
    uColor2: { value: new THREE.Color("#ffb100") }, // Magenta
    uColor3: { value: new THREE.Color("#ffff00") }, // Yellow
    uColor4: { value: new THREE.Color("#ffffff") }, // Yellow
  });

  useFrame((state, delta) => {
    uniforms.current.uTime.value += delta + 0.03;
  });

  return (
    <mesh ref={meshRef} position={[0, 1.3, 0]} >
      <sphereGeometry args={[1, 128, 128]} />
      <shaderMaterial
        uniforms={uniforms.current}
        vertexShader={`
          varying vec2 vUv;
          varying vec3 vNormal;
          uniform float uTime;

          void main() {
            vUv = uv;
            vNormal = normal;

            // Slight distortion for liquid effect
            vec3 newPosition = position + normal * 0.0 * sin(uTime + position.y * 0.0);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          varying vec3 vNormal;
          uniform float uTime;
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          uniform vec3 uColor3;
          uniform vec3 uColor4;

          // Simple noise
          float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
          }

          float noise(vec2 st) {
            vec2 i = floor(st);
            vec2 f = fract(st);
            float a = random(i);
            float b = random(i + vec2(1.0, 0.0));
            float c = random(i + vec2(0.0, 1.0));
            float d = random(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
          }

          void main() {
            // Animated noise for liquid flow
            float n = noise(vUv * 5.0 + vec2(uTime * 0.3, uTime * 0.2));

            // Blend 3 colors
            vec3 color = mix(uColor1, uColor2, n);
            color = mix(color, uColor3, sin(uTime + n * 6.2831) * 0.5 + 0.5);

            // Lighting effect
            float lighting = dot(normalize(vNormal), normalize(vec3(0.0, 0.0, 1.0)));
            color *= lighting * 2.2;

            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}
