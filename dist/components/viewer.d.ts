import { Object3D, ShaderMaterial, TextureLoader, SphereBufferGeometry, Texture } from './three';
import { Style } from './style';
import { MeshDensity } from './density';
import { TextureType } from './texture';
export default class Viewer extends Object3D {
    props: object;
    protected loader: TextureLoader;
    protected obj: Object3D;
    protected geometry: SphereBufferGeometry;
    protected material: ShaderMaterial;
    constructor(texturePath?: string, depthPath?: string, textureType?: TextureType, meshDensity?: MeshDensity, style?: Style, displacement?: number);
    protected createSphere(radius: number, meshDensity: MeshDensity): SphereBufferGeometry;
    /** Internal utility to load texture and set the shader uniforms */
    protected setTextures(texturePath: string, depthPath: string, textureType: TextureType): void;
    /** An internal util to create the scene Object3D */
    protected createSceneObjectWithStyle(style: Style): Object3D;
    /** Promised wrapper for the TextureLoader */
    protected load(texturePath: string): Promise<Texture>;
    /** Toggle vieweing texture or depthmap in viewer */
    toggleDepthDebug(state?: boolean): void;
    /** Setter for displacement amount */
    setDisplacement(amount: number): void;
}
