
/** Small util to get the lower half of a texture (in our case the depthmap) */
vec3 getDepthFromBottomHalf(sampler2D tex, vec2 uvs) {
    
    /** Chop the uvs to the lower half of the texture (i.e top-bottom) */
    vec2 lower_half_uvs = vec2(uvs.x, uvs.y * 0.5);

    /** Return the depth texture */
    return texture2D(tex, lower_half_uvs).rgb;
}

#pragma glslify: export(getDepthFromBottomHalf)
