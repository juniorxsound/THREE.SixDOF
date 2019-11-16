
/** Small util to get the depth texture */
vec3 getDepth(sampler2D depth, vec2 uvs) {

    /** Return the depth texture */
    return texture2D(depth, uvs).rgb;
}

#pragma glslify: export(getDepth)
