enum MeshDensity {
  LOW = 64,
  MEDIUM = 128,
  HIGH = 256,
  EXTRA_HIGH = 512,
  EPIC = 1024,
}

enum Style {
  WIRE = 0,
  POINTS = 1,
  MESH = 2,
}

enum TextureType {
  TOP_BOTTOM,
  SEPERATE,
}

class Props {
  public type: TextureType = TextureType.SEPERATE
  public density: MeshDensity = MeshDensity.EXTRA_HIGH
  public style: Style = Style.MESH
  public displacement: number = 4.0
  public radius: number = 6
}

export { MeshDensity, Style, TextureType, Props }
