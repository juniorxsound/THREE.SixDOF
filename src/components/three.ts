/**
 * A small wrapper for THREE imports so rollup tree-shakes only the parts we need better
 */

import {
    Object3D,
    Material,
    ShaderMaterial,
    TextureLoader,
    BackSide,
    Mesh,
    Points,
    SphereBufferGeometry,
} from 'three'

export {
    Object3D,
    Material,
    ShaderMaterial,
    TextureLoader,
    BackSide,
    Mesh,
    Points,
    SphereBufferGeometry,
}