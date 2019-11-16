
#pragma glslify: getDepth = require('./lib/get-depth-seperate')
#pragma glslify: getDepthFromBottomHalf = require('./lib/get-depth-top-bottom')

// Uniforms
uniform sampler2D colorTexture;
uniform sampler2D depthTexture;
uniform float pointSize;
uniform float displacement;

// Varyings passed to fragment
varying vec2 vUv;

// Internal
float depth;

void main() {

    /** Transform and pass to fragment shader */
    vUv = uv;

    /** Set the GL point size for when rendering points, ignored otherwise */
    gl_PointSize = pointSize;

/** Use compiler definitions to know which method to pick */
#ifdef TOP_BOTTOM
    depth = getDepthFromBottomHalf(colorTexture, vUv).r;
#endif

#ifdef SEPERATE
    depth = getDepth(depthTexture, vUv).r;
#endif

    /** 
    * Invert the normals (since they are pointing outwards) and 
    * move the position on the normal direction scaled by the 
    * displacement which is the depth for the current vertex
    * multiplied by a `displacement` scalaer
    **/
    float disp = displacement * depth;
    vec3 offset = position + (-normal) * disp;

    /** Transform */
    gl_Position = projectionMatrix *
                    modelViewMatrix *
                    vec4(offset, 1.0);
}