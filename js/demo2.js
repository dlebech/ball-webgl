// demo2.js
// Spheres bouncing around a room
(function() {

    var camera, scene, renderer,
        spheres = [], room,
        edge = [window.innerWidth/2, window.innerHeight/2, 500],
        animating = false;
    
    function sphere( mesh ) {
        this.mesh = mesh;
        this.direction = [ 
            Math.round(Math.random()) == 1 ? 1 : -1, 
            Math.round(Math.random()) == 1 ? 1 : -1,
            Math.round(Math.random()) == 1 ? 1 : -1
        ];
    
        this.speed = Math.random() * 5 + 5;
    
        this.updatePosition = function () {
            this.mesh.position.x += this.direction[0]*this.speed;
            this.mesh.position.y += this.direction[1]*this.speed;
            this.mesh.position.z += this.direction[2]*this.speed;
        }
    
        this.updateDirection = function() {
            if (Math.abs(this.mesh.position.x) > edge[0])
                this.direction[0] = -this.direction[0];
            if (Math.abs(this.mesh.position.y) > edge[1])
                this.direction[1] = -this.direction[1];
            if (Math.abs(this.mesh.position.z) > edge[2])
                this.direction[2] = -this.direction[2];
        }
    
    }
    
    function init() {
    
        scene = new THREE.Scene();
    
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 1000;
    
        for (var i = 0; i < 5; i++) {
            var geometry = new THREE.SphereGeometry( 30, 10, 10);
            var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
        
            spheres[i] = new sphere ( new THREE.Mesh( geometry, material ) );
    
            scene.add( spheres[i].mesh );
        }
    
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
            for (var i = 0; i < spheres.length; i++) {
                spheres[i].updatePosition();
                spheres[i].updateDirection();
            }
    
            // note: three.js includes requestAnimationFrame shim
            window.animationId = requestAnimationFrame( animate );
            render();
        }
    }
    
    function render() {
        renderer.render( scene, camera );
    }

    var Demo2 = function() {};

    Demo2.prototype.start = function() {
        if (window.animationId !== null)
            cancelAnimationFrame(window.animationId);
        init();
        animating = true;
        animate();
    }

    Demo2.prototype.stop = function() {
        animating = false;
    }

    window.Demo2 = new Demo2();
})();
