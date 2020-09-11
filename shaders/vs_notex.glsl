#version 300 es

in vec3 a_position;

in vec3 inNormal;

out vec3 fsNormal;
out vec3 fsCamera;
out vec3 pos;

uniform mat4 matrix; 
uniform mat4 nMatrix;
uniform mat4 vwMatrix;

void main() {
pos = (vwMatrix * vec4(a_position,1.0)).xyz;
fsNormal = mat3(nMatrix) * inNormal; 
fsCamera = mat3(vwMatrix) * a_position;
gl_Position = matrix * vec4(a_position,1.0);

}