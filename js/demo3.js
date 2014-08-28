// demo3.js
// Spheres bouncing around a room. Walls are lid up when hit.
// The room is centered around (x,y,z) = (0,0,0)
//
(function() {

    var camera, scene, renderer, spheres = [], planes = [],
        windowWidth = window.innerWidth,
        windowHeight = window.innerHeight,
        windowDepth = 1000,
        maxwidth = windowWidth/2,
        maxheight = windowHeight/2,
        maxdepth = windowDepth/2,
        animating = false;

    var planeLocation = {
        LEFT: 0,
        RIGHT: 1,
        TOP: 2,
        BOTTOM: 3,
        BACK: 4
    };
    
    function plane( mesh ) {
        this.mesh = mesh;
        this.timeleft = 500;
    }
    
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
    
        this.updateCollision = function() {
            if (this.mesh.position.x >= maxwidth) {
                hitPlane(planeLocation.RIGHT);
                this.direction[0] *= -1;
            }
            else if (this.mesh.position.x <= -maxwidth) {
                hitPlane(planeLocation.LEFT);
                this.direction[0] *= -1;
            }
    
            if (this.mesh.position.y >= maxheight) {
                hitPlane(planeLocation.TOP);
                this.direction[1] *= -1;
            }
            else if (this.mesh.position.y <= -maxheight) {
                hitPlane(planeLocation.BOTTOM);
                this.direction[1] *= -1;
            }
    
            if (this.mesh.position.z >= maxdepth) {
                hitPlane(planeLocation.BACK);
                this.direction[2] *= -1;
            }
            else if (this.mesh.position.z <= -maxdepth) {
                this.direction[2] *= -1;
            }
        }
    }
    
    function init() {
    
        scene = new THREE.Scene();
    
        camera = new THREE.PerspectiveCamera( 75, windowWidth / windowHeight, 1, 10000 );
        camera.position.z = 1000;
    
        for (var i = 0; i < 2; i++) {
            var geometry = new THREE.SphereGeometry( 30, 10, 10);
            var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
        
            spheres[i] = new sphere ( new THREE.Mesh( geometry, material ) );
    
            scene.add( spheres[i].mesh );
        }
    
        renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize( windowWidth, windowHeight );
    
        var renderarea = document.getElementById('render-area');
        // Remove all existing nodes.
        while (renderarea.firstChild) {
            renderarea.removeChild(renderarea.firstChild);
        }
        renderarea.appendChild( renderer.domElement );
    
        lastTime = new Date();
    }
    
    function cleanupPlanes( elapsed ) {
        for (i = 0; i < planes.length; i++) {
            if (elapsed >= 0)
                planes[i].timeleft -= elapsed;
    
            if (planes[i].timeleft <= 0) {
                scene.remove( planes[i].mesh );
                planes.splice(i,1);
                i--;
            }
        }
    }
    
    function hitPlane(planeLoc) {
        var w, h, posx = 0, posy = 0, posz = 0, rotx = 0, roty = 0, rotz = 0;
        switch (planeLoc) {
            case planeLocation.BACK:
                w = windowWidth;
                h = windowHeight;
                posz = -maxdepth; 
                break;
            case planeLocation.LEFT:
                w = windowDepth;
                h = windowHeight;
                posx = -maxwidth;
                roty = Math.PI/2;
                break;
            case planeLocation.RIGHT:
                w = windowDepth;
                h = windowHeight;
                posx = maxwidth;
                roty = -Math.PI/2;
                break;
            case planeLocation.BOTTOM:
                w = windowWidth;
                h = windowDepth;
                posy = -maxheight;
                rotx = -Math.PI/2;
                break;
            case planeLocation.TOP:
                w = windowWidth;
                h = windowDepth;
                posy = maxheight;
                rotx = Math.PI/2;
                break;
        }
    
        geometry = new THREE.PlaneGeometry( w, h );
        material = new THREE.MeshBasicMaterial( { color: 0x0000ff, opacity: 0.25 } );
        planeMesh = new THREE.Mesh( geometry, material );
        planeMesh.position.x = posx;
        planeMesh.position.y = posy;
        planeMesh.position.z = posz;
        planeMesh.rotation.x = rotx;
        planeMesh.rotation.y = roty;
        planeMesh.rotation.z = rotz;
    
        var thePlane = new plane ( planeMesh );
        planes.push(thePlane);
        
        scene.add( thePlane.mesh );
    }
    
    var lastTime = 0;
    
    function animate() {
        if (animating) {
            var now = new Date();
            var elapsed = now.getTime() - lastTime.getTime();
            lastTime = now;
    
            for (var i = 0; i < spheres.length; i++) {
                spheres[i].updatePosition();
                spheres[i].updateCollision();
            }
    
            cleanupPlanes( elapsed );
    
            // note: three.js includes requestAnimationFrame shim
            window.animationId = requestAnimationFrame( animate );
            render();
        }
    }
    
    function render() {
        renderer.render( scene, camera );
    }
    
    var Demo3 = function() {};

    Demo3.prototype.start = function() {
        if (window.animationId !== null)
            cancelAnimationFrame(window.animationId);
        init();
        animating = true;
        animate();
    }

    Demo3.prototype.stop = function() {
        animating = false;
    }

    window.Demo3 = new Demo3();

})();
