#version 300 es

precision mediump float;

in vec3 fsNormal;
in vec3 fsCamera;
in vec3 pos;

out vec4 outColor;

uniform vec4 tailColor;
uniform vec3 lightDirection; 
uniform vec3 lightColor; 
uniform vec4 specularColor;
uniform vec3 ambientColor;
uniform vec3 hemisphericUpColor;
uniform vec3 hemisphericDownColor;
uniform mat4 lightDirMatrix;
uniform mat4 vMatrix;
uniform vec3 pointPosition;
uniform float decay;
uniform float targetDist;
uniform float specShine;

void main() {
vec4 colorH = vec4(1.0,1.0,1.0,1.0);
vec4 colorT = tailColor;
vec3 color = lightColor;
vec3 nNormal = normalize(fsNormal);
vec3 eyedirVec = normalize(-pos);
vec3 n = nNormal;
vec3 nCamera = nNormal;