import { Object3D, TextureLoader, ShaderMaterial, BackSide, SphereBufferGeometry, Mesh, Points } from 'three';

/**
 * A small wrapper for THREE imports so rollup tree-shakes only the parts we need better
 */

var frag = "#define GLSLIFY 1\nuniform sampler2D map;\nuniform sampler2D depthMap;\nuniform float debugDepth;\nuniform bool isSeperate;\nuniform float opacity;\n\nvarying vec2 vUv;\nvarying vec3 vNormal;\n\nvoid main() {\n\n    // If it's a single texture crop the uvs used to read the textures\n    vec2 depthUvs = isSeperate ? vUv : vec2(vUv.x, vUv.y * 0.5);\n    vec2 colorUvs = isSeperate ? vUv : vec2(vUv.x, (vUv.y * 0.5) + 0.5);\n\n    vec3 depth;\n\n    // @TODO This is a pretty expansive op perhaps split it into two shaders and pick one when compiling the WebGL program\n    if (isSeperate) {\n        depth = texture2D(depthMap, depthUvs).rgb;\n    } else {\n        depth = texture2D(map, depthUvs).rgb;\n    }\n    vec3 color = texture2D(map, colorUvs).rgb;\n\n    // Mix the depth and color based on debugDepth value\n    vec3 depthColorMixer = mix(color, depth , debugDepth);\n\n    // Render dat fragment\n    gl_FragColor = vec4(depthColorMixer, opacity);\n}"; // eslint-disable-line

var vert = "#define GLSLIFY 1\nvarying vec2 vUv;\nvarying vec3 vNormal;\n\nuniform sampler2D map;\nuniform sampler2D depthMap;\nuniform bool isSeperate;\nuniform float pointSize;\nuniform float displacement;\n\nvoid main() {\n    vUv = uv;\n    vNormal = normalMatrix * normal;\n    gl_PointSize = pointSize;\n\n    // Transform the vert by the depth value (per vertex in the normals direction)\n    vec3 vertPos = position;\n    vec2 depthUvs = isSeperate ? uv : vec2(uv.x, uv.y * 0.5);\n    vec4 depth;\n\n    // @TODO This is a pretty expansive op perhaps split it into two shaders and pick one when compiling the WebGL program\n    if (isSeperate) {\n        depth = texture2D(depthMap, depthUvs);\n    } else {\n        depth = texture2D(map, depthUvs);\n    }\n    vertPos += (depth.r * vNormal) * displacement;\n\n    gl_Position = projectionMatrix *\n                    modelViewMatrix *\n                    vec4(vertPos, 1.0);\n}"; // eslint-disable-line

var Uniforms = {
  map: {
    type: 't',
    value: null
  },
  depthMap: {
    type: 't',
    value: null
  },
  time: {
    type: 'f',
    value: 0.0
  },
  opacity: {
    type: 'f',
    value: 1.0
  },
  pointSize: {
    type: 'f',
    value: 3.0
  },
  debugDepth: {
    type: 'f',
    value: 0.0
  },
  isSeperate: {
    type: 'b',
    value: false
  },
  displacement: {
    type: 'f',
    value: 1.0
  }
};

var Style;

(function (Style) {
  Style[Style["WIRE"] = 0] = "WIRE";
  Style[Style["POINTS"] = 1] = "POINTS";
  Style[Style["MESH"] = 2] = "MESH";
})(Style || (Style = {}));

var MeshDensity;

(function (MeshDensity) {
  MeshDensity[MeshDensity["LOW"] = 64] = "LOW";
  MeshDensity[MeshDensity["MEDIUM"] = 128] = "MEDIUM";
  MeshDensity[MeshDensity["HIGH"] = 256] = "HIGH";
  MeshDensity[MeshDensity["EXTRA_HIGH"] = 512] = "EXTRA_HIGH";
  MeshDensity[MeshDensity["EPIC"] = 1024] = "EPIC";
})(MeshDensity || (MeshDensity = {}));

var TextureType;

(function (TextureType) {
  TextureType[TextureType["TOP_BOTTOM"] = 0] = "TOP_BOTTOM";
  TextureType[TextureType["SEPERATE"] = 1] = "SEPERATE";
})(TextureType || (TextureType = {}));

class Viewer extends Object3D {
  constructor() {
    var texturePath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
    var depthPath = arguments.length > 1 ? arguments[1] : undefined;
    var textureType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : TextureType.TOP_BOTTOM;
    var meshDensity = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : MeshDensity.HIGH;
    var style = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : Style.MESH;
    var displacement = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
    super();
    this.props = void 0;
    this.loader = new TextureLoader();
    this.obj = void 0;
    this.geometry = void 0;
    this.material = new ShaderMaterial({
      uniforms: Uniforms,
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      side: BackSide
    });

    if (!texturePath) {
      throw new Error('Texture path must be defined when creating a viewer');
    }

    this.createSphere(10, meshDensity);
    this.setTextures(texturePath, depthPath, textureType);
    this.setDisplacement(displacement);
    /** Create the Mesh/Points and add it to the viewer object */

    this.obj = this.createSceneObjectWithStyle(style);
    super.add(this.obj);
  }

  createSphere(radius, meshDensity) {
    this.geometry = new SphereBufferGeometry(radius, meshDensity, meshDensity);
  }
  /** Internal utility to load texture and set the shader uniforms */


  setTextures(texturePath, depthPath, textureType) {
    var _this = this;

    if (textureType === TextureType.SEPERATE) {
      if (!depthPath) {
        throw new Error('When using seperate textures you must provide a depth texture as well');
      }
      /** Load the depthmap */


      this.load(depthPath).then(function (texture) {
        /** Inform the shader we are providing two seperate textures and set the texture */
        _this.material.uniforms.isSeperate.value = true;
        _this.material.uniforms.depthMap.value = texture;
      })["catch"](function (err) {
        throw new Error(err);
      });
    } else {
      this.material.uniforms.isSeperate.value = false;
    }
    /** Load the texture */


    this.load(texturePath).then(function (texture) {
      _this.material.uniforms.map.value = texture;
    })["catch"](function (err) {
      throw new Error(err);
    });
  }
  /** An internal util to create the scene Object3D */


  createSceneObjectWithStyle(style) {
    switch (style) {
      case Style.WIRE:
        this.material.wireframe = true;

      case Style.MESH:
        return new Mesh(this.geometry, this.material);

      case Style.POINTS:
        return new Points(this.geometry, this.material);
    }
  }
  /** Promised wrapper for the TextureLoader */


  load(texturePath) {
    var _this2 = this;

    return new Promise(function (resolve, reject) {
      _this2.loader.load(texturePath, function (texture) {
        return resolve(texture);
      }, undefined, function () {
        return reject("Error loading texture error");
      });
    });
  }

  resetStyle() {
    this.material.wireframe = false;
  }
  /** Toggle vieweing texture or depthmap in viewer */


  toggleDepthDebug(state) {
    this.material.uniforms.debugDepth.value = state != undefined ? state : !this.material.uniforms.debugDepth.value;
  }
  /** Setter for displacement amount */


  setDisplacement(amount) {
    this.material.uniforms.displacement.value = amount;
  }

  setStyle(style) {
    super.remove(this.obj);
    this.resetStyle();
    this.obj = this.createSceneObjectWithStyle(style);
    super.add(this.obj);
  }

  setStyleFromString(style) {
    super.remove(this.obj);
    this.resetStyle();
    this.obj = this.createSceneObjectWithStyle(Style[style]);
    super.add(this.obj);
  }

}

export { MeshDensity, Style, TextureType, Viewer };
//# sourceMappingURL=three-6dof.esm.js.map
