import {
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
} from './three'

// @ts-ignore
import frag from '../shaders/sixdof.frag'
// @ts-ignore
import vert from '../shaders/sixdof.vert'

import { Uniforms } from './uniforms'
import { Style, MeshDensity, TextureType, Props } from './constants'

export default class Viewer extends Object3D {
  /** Default props if not provided */
  private props: Props = new Props()

  private static geometry: SphereBufferGeometry
  private material: ShaderMaterial = new ShaderMaterial({
    uniforms: Uniforms,
    vertexShader: vert,
    fragmentShader: frag,
    transparent: true,
    side: BackSide,
  })

  constructor(texture: Texture, depth?: Texture, props?: object) {
    super()

    /** Assign the user provided props, if any */
    this.setProps(this.props, props)

    // /** Add the compiler definitions needed to pick the right GLSL methods */
    this.setShaderDefines(this.material, [TextureType[this.props.type]])

    /**
     * Create the geometry only once, it can be shared between instances
     *  of the viewer since it's kept as a static class member
     **/
    if (!Viewer.geometry) {
      Viewer.geometry = this.createSphereGeometry(
        this.props.radius,
        this.props.density,
      )
    }

    /** Assign the textures and update the shader uniforms */
    this.assignTexture(this.props.type, texture, depth)

    /** Set the displacement using the public setter */
    this.displacement = this.props.displacement

    /** Create the Mesh/Points and add it to the viewer object */
    super.add(this.createMesh(Viewer.geometry, this.material, this.props.style))
  }

  /** Small util to set the defines of the GLSL program based on textureType */
  private setShaderDefines(
    material: ShaderMaterial,
    defines: Array<string>,
  ): void {
    defines.forEach(define => (material.defines[define] = ''))
  }

  /** Internal util to create buffer geometry */
  private createSphereGeometry(
    radius: number,
    meshDensity: MeshDensity,
  ): SphereBufferGeometry {
    return new SphereBufferGeometry(radius, meshDensity, meshDensity)
  }

  /** Internal util to set viewer props from config object */
  private setProps(viewerProps: Props, userProps?: object): void {
    if (!userProps) return

    /** Iterate over user provided props and assign to viewer props */
    for (let prop in userProps) {
      if (viewerProps[prop]) {
        viewerProps[prop] = userProps[prop]
      } else {
        console.warn(
          `THREE.SixDOF: Provided ${prop} in config but it is not a valid property and being ignored`,
        )
      }
    }
  }

  /** Internal util to assign the textures to the shader uniforms */
  private assignTexture(
    type: TextureType,
    colorTexture: Texture,
    depthTexture?: Texture,
  ): void {
    /** Check wheter we are rendering top bottom or just single textures */
    if (type === TextureType.SEPERATE) {
      if (!depthTexture)
        throw new Error(
          'When using seperate texture type, depthmap must be provided',
        )
      this.depth = this.setDefaultTextureProps(depthTexture)
    }

    /** Assign the main texture */
    this.texture = this.setDefaultTextureProps(colorTexture)
  }

  private setDefaultTextureProps(texture: Texture): Texture {
    texture.minFilter = NearestFilter
    texture.magFilter = LinearFilter
    texture.format = RGBFormat
    texture.generateMipmaps = false
    return texture
  }

  /** An internal util to create the Mesh Object3D */
  private createMesh(
    geo: SphereBufferGeometry,
    mat: ShaderMaterial,
    style: Style,
  ): Object3D {
    switch (style) {
      case Style.WIRE:
        if (!this.material.wireframe) this.material.wireframe = true
        return new Mesh(geo, mat)
      case Style.MESH:
        if (this.material.wireframe) this.material.wireframe = false
        return new Mesh(geo, mat)
      case Style.POINTS:
        return new Points(geo, mat)
    }
  }

  /** Toggle vieweing texture or depthmap in viewer */
  public toggleDepthDebug(state?: boolean): void {
    this.material.uniforms.debugDepth.value =
      state != undefined ? state : !this.material.uniforms.debugDepth.value
  }

  /** Setter for displacement amount */
  public set displacement(val: number) {
    this.material.uniforms.displacement.value = val
  }

  /** Setter for depthmap uniform */
  public set depth(map: Texture) {
    this.material.uniforms.depthTexture.value = map
  }

  /** Setter for depthmap uniform */
  public set texture(map: Texture) {
    this.material.uniforms.colorTexture.value = map
  }

  /** Setter for the opacity */
  public set opacity(val: number) {
    this.material.uniforms.opacity.value = val
  }
  
  /** Setter for the point size */
  public set pointSize(val: number) {
    this.material.uniforms.pointSize.value = val
  }

  /** Getter for the current viewer props */
  public get config(): Props {
    return this.props
  }

  /** Getter for the opacity */
  public get opacity(): number {
    return this.material.uniforms.opacity.value
  }

  /** Getter for the point size */
  public get pointSize(): number {
    return this.material.uniforms.pointSize.value
  }

  /** Getter for displacement amount */
  public get displacement(): number {
    return this.material.uniforms.displacement.value
  }

  /** Getter for texture */
  public get texture(): Texture {
    return this.material.uniforms.colorTexture.value
  }

  /** Getter for the depth texture */
  public get depth(): Texture {
    return this.material.uniforms.opacity.value
  }
}
