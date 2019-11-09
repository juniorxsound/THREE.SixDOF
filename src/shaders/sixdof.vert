varying vec2 vUv;
varying vec3 vNormal;

uniform sampler2D map;
uniform sampler2D depthMap;
uniform bool isSeperate;
uniform float pointSize;
uniform float displacement;

void main() {
    vUv = uv;
    vNormal = normalMatrix * normal;
    gl_PointSize = pointSize;

    // Transform the vert by the depth value (per vertex in the normals direction)
    vec3 vertPos = position;
    vec2 depthUvs = isSeperate ? uv : vec2(uv.x, uv.y * 0.5);
    vec4 depth;

    // @TODO This is a pretty expansive op perhaps split it into two shaders and pick one when compiling the WebGL program
    if (isSeperate) {
        depth = texture2D(depthMap, depthUvs);
    } else {
        depth = texture2D(map, depthUvs);
    }
    vertPos += (depth.r * vNormal) * displacement;

    gl_Position = projectionMatrix *
                    modelViewMatrix *
                    vec4(vertPos, 1.0);
}