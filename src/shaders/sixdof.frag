uniform sampler2D map;
uniform sampler2D depthMap;
uniform float debugDepth;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
    vec4 depthColorMixer = mix(texture2D(map, vUv), texture2D(depthMap, vUv), debugDepth);
    gl_FragColor = depthColorMixer;
}