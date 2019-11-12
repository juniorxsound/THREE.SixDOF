
/** Small util to get the upper half of a texture (in our case the color texture) */
vec3 getColorFromUpperHalf(sampler2D tex, vec2 uvs) {
    
    /** Chop the uvs to the lower half of the texture (i.e top-bottom) */
    vec2 upper_half_uvs = vec2(uvs.x, (uvs.y * 0.5) + 0.5);

    /** Return the depth texture */
    return texture2D(tex, upper_half_uvs).rgb;
}

#pragma glslify: export(getColorFromUpperHalf)
