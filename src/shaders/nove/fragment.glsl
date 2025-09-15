precision highp float;
varying vec2 vUv;
uniform float u_time;
uniform vec3 u_tintA;
uniform vec3 u_tintB;

// Hash noise
float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+78.233); return fract(p.x*p.y); }

// 2D fbm
float fbm(vec2 p){
  float f = 0.0, a = 0.5;
  for(int i=0;i<5;i++){
    f += a * (hash(floor(p)) * 2.0 - 1.0);
    p *= 2.01; a *= 0.5;
  }
  return f * 0.5 + 0.5;
}

// Starfield via hashed points and twinkle
float stars(vec2 uv){
  vec2 g = fract(uv) - 0.5;
  vec2 id = floor(uv);
  float n = hash(id);
  float size = mix(0.002, 0.008, hash(id+7.3));
  float d = length(g + vec2(sin(n*6.2831 + u_time*0.7), cos(n*6.2831 + u_time*0.5))*0.001);
  float s = smoothstep(size, 0.0, d);
  float twinkle = 0.6 + 0.4*sin(u_time*3.0 + n*50.0);
  return s * twinkle;
}

vec3 palette(float t, vec3 a, vec3 b){
  // simple two-color lerp + desat
  return mix(a, b, smoothstep(0.2, 0.8, t));
}

void main(){
  // Spherical UV remap helps concentrate nebula near equator
  vec2 uv = vUv * vec2(4.0, 2.0);
  float neb = fbm(uv + vec2(0.0, u_time*0.05));
  float neb2 = fbm(uv*0.5 + vec2(10.0, -u_time*0.03));
  float cloud = smoothstep(0.45, 0.8, neb*0.6 + neb2*0.7);

  float s = 0.0;
  // Tile space for star density
  s += stars(uv*8.0);
  s += 0.5*stars(uv*16.0 + 3.7);

  vec3 nebula = palette(neb, u_tintA, u_tintB);
  vec3 base = mix(vec3(0.01,0.015,0.06), nebula, cloud);
  vec3 col = base + vec3(1.0,0.95,0.8) * s;

  // Slight hue drift
  col *= 0.9 + 0.1*sin(u_time*0.2);

  gl_FragColor = vec4(col, 1.0);
}
