declare enum MeshDensity {
    LOW = 64,
    MEDIUM = 128,
    HIGH = 256,
    EXTRA_HIGH = 512,
    EPIC = 1024
}
declare enum Style {
    WIRE = 0,
    POINTS = 1,
    MESH = 2
}
declare enum TextureType {
    TOP_BOTTOM = 0,
    SEPERATE = 1
}
declare class Props {
    type: TextureType;
    density: MeshDensity;
    style: Style;
    displacement: number;
    radius: number;
}
export { MeshDensity, Style, TextureType, Props };
