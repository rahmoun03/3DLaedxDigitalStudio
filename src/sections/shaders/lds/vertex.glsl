uniform float uFrequency;
uniform float uTime;

varying float vUtime;
varying vec4 vElevation;
varying vec2 vUv;

void main() {

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // modelPosition.y += sin(modelPosition.x + 0.5) * sin(modelPosition.x * uFrequency + uTime) * 0.3;
    // modelPosition.z += sin(modelPosition.y + 0.5) * sin(modelPosition.y * uFrequency + uTime) * 0.3;
    // modelPosition.x += sin(modelPosition.z + 0.5) * sin(modelPosition.z * uFrequency + uTime) * 0.3;

    // modelPosition.y += sin(modelPosition.x * uFrequency + uTime) * 0.1;
    // modelPosition.z += sin(modelPosition.y * uFrequency + uTime) * 0.1;
    // modelPosition.x += sin(modelPosition.z * uFrequency + uTime) * 0.1;


    // modelPosition.y += sin(modelPosition.x * uFrequency + uTime) * 0.1;
    // modelPosition.z += sin(modelPosition.y * uFrequency + uTime) * 0.1;
    // modelPosition.z += sin(modelPosition.x * uFrequency + uTime) * 0.1;
    // modelPosition.x += sin(modelPosition.z * uFrequency + uTime) * 0.1;

    vec4 viewPostion = viewMatrix * modelPosition;

    vec4 projectionPosition = projectionMatrix * viewPostion;


    // varying
    vUtime = uTime;
    vUv = uv;
    vElevation = modelPosition;


    // return
    gl_Position = projectionPosition;
}
