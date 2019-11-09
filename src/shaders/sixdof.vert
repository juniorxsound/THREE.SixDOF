varying vec2 vUv;
varying vec3 vNormal;

uniform sampler2D map;
uniform sampler2D depthMap;
uniform bool isSeperate;
uniform float pointSize;

void main() {
    vUv = uv;
    vNormal = normalMatrix * normal;
    gl_PointSize = pointSize;

    // Transform the vert by the depth value (per vertex in the normals direction)
    vec3 vertPos = position;
    vertPos += texture2D(depthMap, uv).r * vNormal;

    gl_Position = projectionMatrix *
                    modelViewMatrix *
                    vec4(vertPos, 1.0);
}