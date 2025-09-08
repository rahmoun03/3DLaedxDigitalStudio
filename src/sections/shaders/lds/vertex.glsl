uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;

void main() {

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += sin(modelPosition.x * 8.0) * 0.1;
    modelPosition.z += sin(modelPosition.y * 8.0) * 0.1;
    modelPosition.x += sin(modelPosition.z * 8.0) * 0.1;



    vec4 viewPostion = viewMatrix * modelPosition;




    vec4 projectionPosition = projectionMatrix * viewPostion;




    gl_Position = projectionPosition;
}