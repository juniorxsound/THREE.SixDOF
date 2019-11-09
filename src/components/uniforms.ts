import { Vector2, Vector4 } from 'three'

export const Uniforms: object = {
  map: {
    type: 't',
    value: null,
  },
  depthMap: {
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
  isSeperate: {
    type: 'b',
    value: false,
  },
  displacement: {
    type: 'f',
    value: 1.0,
  },
}
