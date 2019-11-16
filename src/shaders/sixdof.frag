
#pragma glslify: getDepth = require('./lib/get-depth-seperate')
#pragma glslify: getDepthFromBottomHalf = require('./lib/get-depth-top-bottom')
#pragma glslify: getColorFromUpperHalf = require('./lib/get-color-top-bottom')

// Uniforms
uniform sampler2D colorTexture;
uniform sampler2D depthTexture;
uniform float debugDepth;
uniform float opacity;

// Varyings from vertex program
varying vec2 vUv;

// Internal
vec3 depth;
vec3 color;

void main() {

/** Use compiler definitions to know which method to pick */
#ifdef TOP_BOTTOM
    depth = getDepthFromBottomHalf(colorTexture, vUv);
    color = getColorFromUpperHalf(colorTexture, vUv);
#endif

#ifdef SEPERATE
    depth = getDepth(depthTexture, vUv);
    color = texture2D(colorTexture, vUv).rgb;
#endif

    // Mix the depth and color based on debugDepth value
    vec3 depthColorMixer = mix(color, depth , debugDepth);

    // Render dat fragment
    gl_FragColor = vec4(depthColorMixer, opacity);
}
