// demo1.js
// Copied from github.com/mrdoob/three.js readme file
// three.js is:
// Copyright 2010-2014 three.js authors.
// (MIT License).
//
// Modified to work with demopage
(function() {

    var camera, scene, renderer,
        geometry, material, mesh,
        animating = false;
    
    function init() {
    
        scene = new THREE.Scene();
    
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 1000;
    
        geometry = new THREE.BoxGeometry( 200, 200, 200 );
        material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
    
        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );
    
        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
    
        var renderarea = document.getElementById('render-area');
        // Remove all existing nodes.
        while (renderarea.firstChild) {
            renderarea.removeChild(renderarea.firstChild);
        }
        renderarea.appendChild( renderer.domElement );
    }
    
    function animate() {
        if (animating) {
            // note: three.js includes requestAnimationFrame shim
            window.animationId = requestAnimationFrame( animate );
            render();
        }
    }
    
    function render() {
    
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.02;
    
        renderer.render( scene, camera );
    
    }

    var Demo1 = function() {};

    Demo1.prototype.start = function() {
        if (window.animationId !== null)
            cancelAnimationFrame(window.animationId);
        init();
        animating = true;
        animate();
    }

    Demo1.prototype.stop = function() {
        animating = false;
    }

    window.Demo1 = new Demo1();
})();
