THREE.GUI = {
    create: (viewer, scene) => {
        var gui = new dat.GUI();

        // Set some GUI params
        var shaderParams = gui.addFolder('Shader');
        shaderParams.add(sixDofViewer, 'displacement', 0, 7).name('Displacement');
        shaderParams.add(sixDofViewer, 'opacity', 0, 1).name('Opacity');
        shaderParams.add(sixDofViewer, 'pointSize', 0, 10).name('Point Size');
        shaderParams.add({ 'debugDepth': false }, 'debugDepth')
            .name('Debug Depth')
            .onChange(val => {
                sixDofViewer.toggleDepthDebug(val);
            });
        shaderParams.add({
            'changeStyle': () => { }
        }, 'changeStyle', {
            'Mesh': SixDOF.Style[SixDOF.Style.MESH],
            'Wireframe': SixDOF.Style[SixDOF.Style.WIRE],
            'Pointcloud': SixDOF.Style[SixDOF.Style.POINTS]
        })
            .name('Rendering Style')
            .onChange(val => {
                scene.remove(sixDofViewer);
                sixDofViewer = new SixDOF.Viewer(colorTexture, depthTexture, {
                    'style': SixDOF.Style[val]
                });
                scene.add(sixDofViewer);
            });


        return gui;
    }
}