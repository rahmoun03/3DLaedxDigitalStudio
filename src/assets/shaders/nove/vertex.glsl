varying vec2 vUv;
uniform float u_time;

void main() {
  vUv = uv;
  // Mild spherical breathing to imply gaseous depth
  vec3 pos = position + normal * (0.01 * sin(u_time * 0.7 + position.y * 6.0));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
