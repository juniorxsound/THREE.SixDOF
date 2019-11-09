import {
    Object3D,
    Material,
    ShaderMaterial,
    TextureLoader,
    BackSide,
    Mesh,
    Points,
    SphereBufferGeometry,
} from './three'

import frag from '../shaders/sixdof.frag'
import vert from '../shaders/sixdof.vert'

import { Uniforms } from './uniforms'
import { Style } from './style'
import { MeshDensity } from './density'
import { TextureType } from './texture'

export default class Viewer extends Object3D {
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
        textureType: TextureType = TextureType.TOP_BOTTOM,
        meshDensity: MeshDensity = MeshDensity.HIGH,
        style: Style = Style.MESH,
        displacement: number = 1,
    ) {
        super()

        if (!texturePath) {
            throw new Error('Texture path must be defined when creating a viewer')
        }

        this.geometry = this.createSphere(10, meshDensity)
        this.setTextures(texturePath, depthPath, textureType)
        this.setDisplacement(displacement)

        /** Create the Mesh/Points and add it to the viewer object */
        this.obj = this.createSceneObjectWithStyle(style)
        this.add(this.obj)
    }

    protected createSphere(radius: number, meshDensity: MeshDensity): SphereBufferGeometry {
        return new SphereBufferGeometry(radius, meshDensity, meshDensity)
    }

    /** Internal utility to load texture and set the shader uniforms */
    protected setTextures(texturePath: string, depthPath: string, textureType: TextureType): void {
        if (textureType === TextureType.SEPERATE) {
            if (!depthPath) {
                throw new Error(
                    'When using seperate textures you must provide a depth texture as well',
                )
            }

            /** Load the depthmap */
            this.load(depthPath)
                .then(texture => {
                    /** Inform the shader we are providing two seperate textures and set the texture */
                    this.material.uniforms.isSeperate.value = true
                    this.material.uniforms.depthMap.value = texture
                })
                .catch(err => {
                    throw new Error(err)
                })
        } else {
            this.material.uniforms.isSeperate.value = false
        }

        /** Load the texture */
        this.load(texturePath)
            .then(texture => {
                this.material.uniforms.map.value = texture
            })
            .catch(err => {
                throw new Error(err)
            })
    }

    /** An internal util to create the scene Object3D */
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

    /** Promised wrapper for the TextureLoader */
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

    /** Toggle vieweing texture or depthmap in viewer */
    public toggleDepthDebug(state?: boolean): void {
        this.material.uniforms.debugDepth.value =
            state != undefined ? state : !this.material.uniforms.debugDepth.value
    }

    /** Setter for displacement amount */
    public setDisplacement(amount: number): void {
        this.material.uniforms.displacement.value = amount
    }
}