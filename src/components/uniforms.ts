import { Vector2, Vector4 } from 'three'

export const Uniforms: object = {
  colorTexture: {
    type: 't',
    value: null,
  },
  depthTexture: {
    type: 't',
    value: null,
  },
  time: {
    type: 'f',
    value: 0.0,
  },
  opacity: {
    type: 'f',
    value: 1.0,
  },
  pointSize: {
    type: 'f',
    value: 3.0,
  },
  debugDepth: {
    type: 'f',
    value: 0.0,
  },
  displacement: {
    type: 'f',
    value: 1.0,
  },
}
