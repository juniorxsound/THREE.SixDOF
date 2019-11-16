/**
 * A small wrapper for THREE imports so rollup tree-shakes only the parts we need better
 */

/* eslint  @typescript-eslint/camelcase: 0 */

export {
  Object3D,
  ShaderMaterial,
  BackSide,
  Mesh,
  Points,
  SphereBufferGeometry,
  Texture,
  NearestFilter,
  LinearFilter,
  RGBFormat,
} from 'three'
