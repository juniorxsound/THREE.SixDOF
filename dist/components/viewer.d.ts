import { Object3D, Texture } from './three';
import { Props } from './constants';
export default class Viewer extends Object3D {
    /** Default props if not provided */
    private props;
    private static geometry;
    private material;
    constructor(texture: Texture, depth?: Texture, props?: object);
    /** Small util to set the defines of the GLSL program based on textureType */
    private setShaderDefines;
    /** Internal util to create buffer geometry */
    private createSphereGeometry;
    /** Internal util to set viewer props from config object */
    private setProps;
    /** Internal util to assign the textures to the shader uniforms */
    private assignTexture;
    private setDefaultTextureProps;
    /** An internal util to create the Mesh Object3D */
    private createMesh;
    /** Toggle vieweing texture or depthmap in viewer */
    toggleDepthDebug(state?: boolean): void;
    /** Setter for displacement amount */
    set displacement(val: number);
    /** Setter for depthmap uniform */
    set depth(map: Texture);
    /** Setter for depthmap uniform */
    set texture(map: Texture);
    /** Setter for the opacity */
    set opacity(val: number);
    /** Setter for the point size */
    set pointSize(val: number);
    /** Getter for the current viewer props */
    get config(): Props;
    /** Getter for the opacity */
    get opacity(): number;
    /** Getter for the point size */
    get pointSize(): number;
    /** Getter for displacement amount */
    get displacement(): number;
    /** Getter for texture */
    get texture(): Texture;
    /** Getter for the depth texture */
    get depth(): Texture;
}
