uniform sampler2D map;
uniform sampler2D depthMap;
uniform float debugDepth;
uniform bool isSeperate;
uniform float opacity;

varying vec2 vUv;
varying vec3 vNormal;

void main() {

    // If it's a single texture crop the uvs used to read the textures
    vec2 depthUvs = isSeperate ? vUv : vec2(vUv.x, vUv.y * 0.5);
    vec2 colorUvs = isSeperate ? vUv : vec2(vUv.x, (vUv.y * 0.5) + 0.5);

    vec3 depth;

    // @TODO This is a pretty expansive op perhaps split it into two shaders and pick one when compiling the WebGL program
    if (isSeperate) {
        depth = texture2D(depthMap, depthUvs).rgb;
    } else {
        depth = texture2D(map, depthUvs).rgb;
    }
    vec3 color = texture2D(map, colorUvs).rgb;

    // Mix the depth and color based on debugDepth value
    vec3 depthColorMixer = mix(color, depth , debugDepth);

    // Render dat fragment
    gl_FragColor = vec4(depthColorMixer, opacity);
}