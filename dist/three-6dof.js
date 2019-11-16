(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three')) :
  typeof define === 'function' && define.amd ? define(['exports', 'three'], factory) :
  (global = global || self, factory(global.SixDOF = {}, global.THREE));
}(this, function (exports, three) { 'use strict';

  /**
   * A small wrapper for THREE imports so rollup tree-shakes only the parts we need better
   */

  var frag = "#define GLSLIFY 1\n\n/** Small util to get the depth texture */\nvec3 getDepth(sampler2D depth, vec2 uvs) {\n\n    /** Return the depth texture */\n    return texture2D(depth, uvs).rgb;\n}\n\n/** Small util to get the lower half of a texture (in our case the depthmap) */\nvec3 getDepthFromBottomHalf(sampler2D tex, vec2 uvs) {\n    \n    /** Chop the uvs to the lower half of the texture (i.e top-bottom) */\n    vec2 lower_half_uvs = vec2(uvs.x, uvs.y * 0.5);\n\n    /** Return the depth texture */\n    return texture2D(tex, lower_half_uvs).rgb;\n}\n\n/** Small util to get the upper half of a texture (in our case the color texture) */\nvec3 getColorFromUpperHalf(sampler2D tex, vec2 uvs) {\n    \n    /** Chop the uvs to the lower half of the texture (i.e top-bottom) */\n    vec2 upper_half_uvs = vec2(uvs.x, (uvs.y * 0.5) + 0.5);\n\n    /** Return the depth texture */\n    return texture2D(tex, upper_half_uvs).rgb;\n}\n\n// Uniforms\nuniform sampler2D colorTexture;\nuniform sampler2D depthTexture;\nuniform float debugDepth;\nuniform float opacity;\n\n// Varyings from vertex program\nvarying vec2 vUv;\n\n// Internal\nvec3 depth;\nvec3 color;\n\nvoid main() {\n\n/** Use compiler definitions to know which method to pick */\n#ifdef TOP_BOTTOM\n    depth = getDepthFromBottomHalf(colorTexture, vUv);\n    color = getColorFromUpperHalf(colorTexture, vUv);\n#endif\n\n#ifdef SEPERATE\n    depth = getDepth(depthTexture, vUv);\n    color = texture2D(colorTexture, vUv).rgb;\n#endif\n\n    // Mix the depth and color based on debugDepth value\n    vec3 depthColorMixer = mix(color, depth , debugDepth);\n\n    // Render dat fragment\n    gl_FragColor = vec4(depthColorMixer, opacity);\n}\n"; // eslint-disable-line

  var vert = "#define GLSLIFY 1\n\n/** Small util to get the depth texture */\nvec3 getDepth(sampler2D depth, vec2 uvs) {\n\n    /** Return the depth texture */\n    return texture2D(depth, uvs).rgb;\n}\n\n/** Small util to get the lower half of a texture (in our case the depthmap) */\nvec3 getDepthFromBottomHalf(sampler2D tex, vec2 uvs) {\n    \n    /** Chop the uvs to the lower half of the texture (i.e top-bottom) */\n    vec2 lower_half_uvs = vec2(uvs.x, uvs.y * 0.5);\n\n    /** Return the depth texture */\n    return texture2D(tex, lower_half_uvs).rgb;\n}\n\n// Uniforms\nuniform sampler2D colorTexture;\nuniform sampler2D depthTexture;\nuniform float pointSize;\nuniform float displacement;\n\n// Varyings passed to fragment\nvarying vec2 vUv;\n\n// Internal\nfloat depth;\n\nvoid main() {\n\n    /** Transform and pass to fragment shader */\n    vUv = uv;\n\n    /** Set the GL point size for when rendering points, ignored otherwise */\n    gl_PointSize = pointSize;\n\n/** Use compiler definitions to know which method to pick */\n#ifdef TOP_BOTTOM\n    depth = getDepthFromBottomHalf(colorTexture, vUv).r;\n#endif\n\n#ifdef SEPERATE\n    depth = getDepth(depthTexture, vUv).r;\n#endif\n\n    /** \n    * Invert the normals (since they are pointing outwards) and \n    * move the position on the normal direction scaled by the \n    * displacement which is the depth for the current vertex\n    * multiplied by a `displacement` scalaer\n    **/\n    float disp = displacement * depth;\n    vec3 offset = position + (-normal) * disp;\n\n    /** Transform */\n    gl_Position = projectionMatrix *\n                    modelViewMatrix *\n                    vec4(offset, 1.0);\n}"; // eslint-disable-line

  var Uniforms = {
    colorTexture: {
      type: 't',
      value: null
    },
    depthTexture: {
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
    displacement: {
      type: 'f',
      value: 1.0
    }
  };

  (function (MeshDensity) {
    MeshDensity[MeshDensity["LOW"] = 64] = "LOW";
    MeshDensity[MeshDensity["MEDIUM"] = 128] = "MEDIUM";
    MeshDensity[MeshDensity["HIGH"] = 256] = "HIGH";
    MeshDensity[MeshDensity["EXTRA_HIGH"] = 512] = "EXTRA_HIGH";
    MeshDensity[MeshDensity["EPIC"] = 1024] = "EPIC";
  })(exports.MeshDensity || (exports.MeshDensity = {}));



  (function (Style) {
    Style[Style["WIRE"] = 0] = "WIRE";
    Style[Style["POINTS"] = 1] = "POINTS";
    Style[Style["MESH"] = 2] = "MESH";
  })(exports.Style || (exports.Style = {}));



  (function (TextureType) {
    TextureType[TextureType["TOP_BOTTOM"] = 0] = "TOP_BOTTOM";
    TextureType[TextureType["SEPERATE"] = 1] = "SEPERATE";
  })(exports.TextureType || (exports.TextureType = {}));

  class Props {
    constructor() {
      this.type = exports.TextureType.SEPERATE;
      this.density = exports.MeshDensity.HIGH;
      this.style = exports.Style.MESH;
      this.displacement = 4.0;
      this.radius = 6;
    }

  }

  class Viewer extends three.Object3D {
    /** Default props if not provided */
    constructor(texture, depth, props) {
      super();
      /** Assign the user provided props, if any */

      this.props = new Props();
      this.material = new three.ShaderMaterial({
        uniforms: Uniforms,
        vertexShader: vert,
        fragmentShader: frag,
        transparent: true,
        side: three.BackSide
      });
      this.setProps(this.props, props); // /** Add the compiler definitions needed to pick the right GLSL methods */

      this.setShaderDefines(this.material, [exports.TextureType[this.props.type]]);
      /**
       * Create the geometry only once, it can be shared between instances
       *  of the viewer since it's kept as a static class member
       **/

      if (!Viewer.geometry) {
        Viewer.geometry = this.createSphereGeometry(this.props.radius, this.props.density);
      }
      /** Assign the textures and update the shader uniforms */


      this.assignTexture(this.props.type, texture, depth);
      /** Set the displacement using the public setter */

      this.displacement = this.props.displacement;
      /** Create the Mesh/Points and add it to the viewer object */

      super.add(this.createMesh(Viewer.geometry, this.material, this.props.style));
    }
    /** Small util to set the defines of the GLSL program based on textureType */


    setShaderDefines(material, defines) {
      defines.forEach(function (define) {
        return material.defines[define] = '';
      });
    }
    /** Internal util to create buffer geometry */


    createSphereGeometry(radius, meshDensity) {
      return new three.SphereBufferGeometry(radius, meshDensity, meshDensity);
    }
    /** Internal util to set viewer props from config object */


    setProps(viewerProps, userProps) {
      if (!userProps) return;
      /** Iterate over user provided props and assign to viewer props */

      for (var prop in userProps) {
        if (viewerProps[prop]) {
          viewerProps[prop] = userProps[prop];
        } else {
          console.warn("THREE.SixDOF: Provided ".concat(prop, " in config but it is not a valid property and being ignored"));
        }
      }
    }
    /** Internal util to assign the textures to the shader uniforms */


    assignTexture(type, colorTexture, depthTexture) {
      /** Check wheter we are rendering top bottom or just single textures */
      if (type === exports.TextureType.SEPERATE) {
        if (!depthTexture) throw new Error('When using seperate texture type, depthmap must be provided');
        this.depth = this.setDefaultTextureProps(depthTexture);
      }
      /** Assign the main texture */


      this.texture = this.setDefaultTextureProps(colorTexture);
    }

    setDefaultTextureProps(texture) {
      texture.minFilter = three.NearestFilter;
      texture.magFilter = three.LinearFilter;
      texture.format = three.RGBFormat;
      texture.generateMipmaps = false;
      return texture;
    }
    /** An internal util to create the Mesh Object3D */


    createMesh(geo, mat, style) {
      switch (style) {
        case exports.Style.WIRE:
          if (!this.material.wireframe) this.material.wireframe = true;
          return new three.Mesh(geo, mat);

        case exports.Style.MESH:
          if (this.material.wireframe) this.material.wireframe = false;
          return new three.Mesh(geo, mat);

        case exports.Style.POINTS:
          return new three.Points(geo, mat);
      }
    }
    /** Toggle vieweing texture or depthmap in viewer */


    toggleDepthDebug(state) {
      this.material.uniforms.debugDepth.value = state != undefined ? state : !this.material.uniforms.debugDepth.value;
    }
    /** Setter for displacement amount */


    set displacement(val) {
      this.material.uniforms.displacement.value = val;
    }
    /** Setter for depthmap uniform */


    set depth(map) {
      this.material.uniforms.depthTexture.value = map;
    }
    /** Setter for depthmap uniform */


    set texture(map) {
      this.material.uniforms.colorTexture.value = map;
    }
    /** Setter for the opacity */


    set opacity(val) {
      this.material.uniforms.opacity.value = val;
    }
    /** Setter for the point size */


    set pointSize(val) {
      this.material.uniforms.pointSize.value = val;
    }
    /** Getter for the current viewer props */


    get config() {
      return this.props;
    }
    /** Getter for the opacity */


    get opacity() {
      return this.material.uniforms.opacity.value;
    }
    /** Getter for the point size */


    get pointSize() {
      return this.material.uniforms.pointSize.value;
    }
    /** Getter for displacement amount */


    get displacement() {
      return this.material.uniforms.displacement.value;
    }
    /** Getter for texture */


    get texture() {
      return this.material.uniforms.colorTexture.value;
    }
    /** Getter for the depth texture */


    get depth() {
      return this.material.uniforms.opacity.value;
    }

  }
  Viewer.geometry = void 0;

  exports.Viewer = Viewer;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=three-6dof.js.map
