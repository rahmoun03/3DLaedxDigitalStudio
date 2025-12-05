import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { extend } from "@react-three/fiber";

const SmokeMaterial = shaderMaterial(
  {
    uTime: 0,
    uSize: 40.0,
    uColor: new THREE.Color("#d4c7b5"),
  },
  // Vertex Shader
  `
  uniform float uTime;
  uniform float uSize;
  varying float vAlpha;

  float random(vec3 scale, float seed) {
    return fract(sin(dot(vec3(float(gl_VertexID)) * scale, vec3(12.9898,78.233,37.719))) * 43758.5453 + seed);
  }

  void main() {
    float t = uTime * 0.2 + float(gl_VertexID) * 0.01;

    // Swirl/noise movement
    vec3 pos = position;
    pos.x += sin(t + pos.y) * 0.5;
    pos.z += cos(t * 0.8 + pos.x) * 0.5;
    pos.y += sin(t * 0.5) * 0.3;    // rising motion

    vAlpha = 0.4 + 0.3 * sin(t * 3.0);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * (1.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
  `,
  // Fragment Shader
  `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float alpha = smoothstep(0.5, 0.2, d) * vAlpha; // soft edge smoke
    gl_FragColor = vec4(uColor, alpha);
  }
  `
);

extend({ SmokeMaterial });
export default SmokeMaterial;
