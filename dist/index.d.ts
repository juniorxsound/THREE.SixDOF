import { Object3D, Material, TextureLoader, SphereBufferGeometry } from 'three';
declare enum TextureType {
    TOP_BOTTOM = 0,
    SEPERATE = 1
}
declare enum MeshDensity {
    LOW = 64,
    MEDIUM = 128,
    HIGH = 256,
    EXTRA_HIGH = 512
}
declare enum Style {
    WIRE = 0,
    POINTS = 1,
    MESH = 2
}
declare class Viewer extends Object3D {
    props: object;
    protected loader: TextureLoader;
    protected obj: Object3D;
    protected geometry: SphereBufferGeometry;
    protected material: Material;
    constructor(texturePath?: string, depthPath?: string, textureType?: TextureType, meshDensity?: MeshDensity, style?: Style, displacement?: number);
    protected createSceneObjectWithStyle(style: Style): Object3D;
    protected load(texturePath: string): Promise<string>;
}
export { Viewer, TextureType };
