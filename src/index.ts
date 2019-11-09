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

// Load shaders
import frag from './shaders/sixdof.frag'
import vert from './shaders/sixdof.vert'

import Uniforms from './uniforms'

enum TextureType {
  TOP_BOTTOM,
  SEPERATE,
}

enum MeshDensity {
  LOW = 64,
  MEDIUM = 128,
  HIGH = 256,
  EXTRA_HIGH = 512,
}

enum Style {
  WIRE,
  POINTS,
  MESH,
}

class Viewer extends Object3D {
  public props: object
  protected loader: TextureLoader = new TextureLoader()
  protected obj: Object3D
  protected geometry: SphereBufferGeometry
  protected material: Material = new ShaderMaterial({
    uniforms: Uniforms,
    vertexShader: vert,
    fragmentShader: frag,
    transparent: true,
    side: BackSide,
  })

  constructor(
    texturePath: string = undefined,
    depthPath?: string,
    textureType: TextureType = TextureType.SEPERATE,
    meshDensity: MeshDensity = MeshDensity.EXTRA_HIGH,
    style: Style = Style.MESH,
    displacement: number = 1,
  ) {
    super()

    if (!texturePath)
      throw new Error('Texture path must be defined when creating a viewer')

    this.geometry = new SphereBufferGeometry(10, meshDensity, meshDensity)

    if (textureType === TextureType.SEPERATE) {
      if (!depthPath)
        throw new Error(
          'When using seperate textures you must provide a depth texture as well',
        )

      // Inform the shader we are providing two seperate textures
      this.material.uniforms.isSeperate.value = true

      // Load the depth map
      this.load(depthPath)
        .then(texture => {
          this.material.uniforms.depthMap.value = texture
        })
        .catch(err => {
          throw new Error(err)
        })
    }

    // Load the texture
    this.load(texturePath)
      .then(texture => {
        this.material.uniforms.map.value = texture
      })
      .catch(err => {
        throw new Error(err)
      })

    // Create the Mesh/Points and add it to the viewer object
    this.obj = this.createSceneObjectWithStyle(style)
    this.add(this.obj)
  }

  protected createSceneObjectWithStyle(style: Style): Object3D {
    switch (style) {
      case Style.WIRE:
        this.material.wireframe = true
      case Style.MESH:
        return new Mesh(this.geometry, this.material)
      case Style.POINTS:
        return new Points(this.geometry, this.material)
    }
  }

  protected load(texturePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.loader.load(
        texturePath,
        texture => resolve(texture),
        undefined,
        () => reject(`Error loading texture error`),
      )
    })
  }
}

export { Viewer, TextureType }
