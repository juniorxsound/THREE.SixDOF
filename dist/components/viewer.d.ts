import { Object3D, ShaderMaterial, TextureLoader, IcosahedronBufferGeometry, Texture } from './three';
import { Style } from './style';
import { MeshDensity } from './density';
import { TextureType } from './texture';
export default class Viewer extends Object3D {
    props: object;
    protected loader: TextureLoader;
    protected obj: Object3D;
    protected geometry: IcosahedronBufferGeometry;
    protected material: ShaderMaterial;
    constructor(texturePath?: string, depthPath?: string, textureType?: TextureType, meshDensity?: MeshDensity, style?: Style, displacement?: number);
    private createSphere;
    /** Internal utility to load texture and set the shader uniforms */
    private setTextures;
    /** An internal util to create the scene Object3D */
    protected createSceneObjectWithStyle(style: Style): Object3D;
    /** Promised wrapper for the TextureLoader */
    protected load(texturePath: string): Promise<Texture>;
    protected resetStyle(): void;
    /** Toggle vieweing texture or depthmap in viewer */
    toggleDepthDebug(state?: boolean): void;
    /** Setter for displacement amount */
    setDisplacement(amount: number): void;
    setStyle(style: Style): void;
    setStyleFromString(style: string): void;
}
