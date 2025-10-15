import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

const DissolveMaterial = shaderMaterial(
  {
    uProgress: 0,
    uColor: new THREE.Color("#51a4de"),
    uNoiseScale: 3.0,
    uEdgeWidth: 0.1,
  },
  // vertex shader
  `
  varying vec3 vPosition;
  varying vec3 vNormal;
  void main() {
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * viewMatrix * vec4(vPosition, 1.0);
  }
  `,
  // fragment shader
  `
  varying vec3 vPosition;
  varying vec3 vNormal;
  uniform float uProgress;
  uniform vec3 uColor;
  uniform float uNoiseScale;
  uniform float uEdgeWidth;

  // Simple noise function
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1,0.1,0.1));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  void main() {
    float height = (vPosition.y + 1.0) * 0.5; // normalize Y between 0–1
    float noise = hash(vPosition * uNoiseScale);
    float dissolve = smoothstep(uProgress - uEdgeWidth, uProgress + uEdgeWidth, height + noise * 0.2);

    // Edge glow
    float edge = smoothstep(uProgress, uProgress + uEdgeWidth, height + noise * 0.2);
    vec3 color = mix(uColor, vec3(1.0, 1.0, 1.0), edge * 0.8);

    if (dissolve < 0.5) discard; // dissolve away fragments
    gl_FragColor = vec4(color, 1.0);
  }
  `
);

extend({ DissolveMaterial });
