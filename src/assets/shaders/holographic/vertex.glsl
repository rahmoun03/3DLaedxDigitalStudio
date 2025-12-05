// uniform float uTime;

// varying vec3 vPosition;
// varying vec3 vNormal;
// varying vec2 vUv;


// float random2D(vec2 value) {
//     return fract(sin(dot(value.xy, vec2(12.9898,78.233))) * 43758.5453123);
// }

// void main(){

//     // position 
//     vec4 modelPosition = modelMatrix * vec4(position, 1.0);

//     // glitch
//     float glitchTime = uTime - modelPosition.y;
//     float glitchStrength = sin(glitchTime) + sin(glitchTime * 3.45) + sin(glitchTime * 8.76);
//     glitchStrength /= 3.0;
//     glitchStrength = smoothstep(0.3, 1.0, glitchStrength);
//     glitchStrength *= .25;
//     modelPosition.x += (random2D(modelPosition.xz + uTime * .2) - .5) * glitchStrength;
//     modelPosition.z += (random2D(modelPosition.zx + uTime * .2) - .5) * glitchStrength;

//     // final position
//     gl_Position = projectionMatrix  * viewMatrix  * modelPosition;

//     // model normal
//     vec4 modelNormal = modelMatrix * vec4(normal , 0.0);


//     //varying 
//     // vPosition = modelPosition.xyz;
//     vPosition = position;
//     vNormal = modelNormal.xyz;
//     vUv = uv;
// }








uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

float random2D(vec2 value) {
    return fract(sin(dot(value.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    vUv = uv;
    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float glitchTime = uTime - modelPosition.y;
    float glitchStrength =
        sin(glitchTime) +
        sin(glitchTime * 3.45) +
        sin(glitchTime * 8.76);

    glitchStrength /= 3.5;
    glitchStrength = smoothstep(0.3, 1.0, glitchStrength);
    glitchStrength *= 0.2;

    modelPosition.x += (random2D(modelPosition.xz + uTime * 0.2) - 0.5) * glitchStrength;
    modelPosition.z += (random2D(modelPosition.zx + uTime * 0.2) - 0.5) * glitchStrength;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
    vNormal = modelNormal.xyz;
    vPosition = modelPosition.xyz;
}
