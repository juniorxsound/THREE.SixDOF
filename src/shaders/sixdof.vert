varying vec2 vUv;
varying vec3 vNormal;

uniform sampler2D map;
uniform sampler2D depthMap;
uniform bool isSeperate;
uniform float pointSize;
uniform float displacement;

float depthFromTexture(sampler2D tex1, sampler2D tex2, vec2 uv, bool isSeperate) {
    
    vec2 depthUvs = isSeperate ? uv : vec2(uv.x, uv.y * 0.5);

    if (isSeperate) return texture2D(tex2, depthUvs).r;

    return texture2D(tex1, depthUvs).r;
}

void main() {

    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    gl_PointSize = pointSize;

    float depth = depthFromTexture(map, depthMap, uv, isSeperate);
    float disp = displacement * depth;
    vec3 offset = position + (-normal) * disp;

    gl_Position = projectionMatrix *
                    modelViewMatrix *
                    vec4(offset, 1.0);
}