var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FishyBoids;
(function (FishyBoids) {
    var FishMesh = (function (_super) {
        __extends(FishMesh, _super);
        function FishMesh(position, baseColour) {
            if (position === void 0) { position = new THREE.Vector3(); }
            if (baseColour === void 0) { baseColour = new THREE.Color(); }
            var _this = _super.call(this) || this;
            _this.animStep = 0;
            _this.position = position;
            _this.geometry = new FishyBoids.FishGeometry();
            _this.material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, vertexColors: THREE.FaceColors });
            _this.geometry.faces[0].color.set(baseColour);
            _this.geometry.faces[1].color.set(baseColour);
            _this.geometry.faces[2].color.setRGB(baseColour.r - 0.4, baseColour.g - 0.4, baseColour.b - 0.4);
            var finColour = new THREE.Color(baseColour.r - 0.3, baseColour.g - 0.3, baseColour.b - 0.3);
            _this.geometry.faces[3].color.set(finColour);
            _this.geometry.faces[4].color.set(finColour);
            return _this;
        }
        FishMesh.prototype.animate = function (speed) {
            if (speed === void 0) { speed = 0.2; }
            var newTailPos = Math.sin(this.animStep) * 0.6;
            var newFinPos = Math.sin(this.animStep) * 0.4 - 1;
            this.geometry.moveTail(newTailPos);
            this.geometry.moveFins(newFinPos);
            this.geometry.verticesNeedUpdate = true;
            this.animStep = (this.animStep + speed + this.rotation.z) % (Math.PI * 2);
        };
        return FishMesh;
    }(THREE.Mesh));
    FishyBoids.FishMesh = FishMesh;
})(FishyBoids || (FishyBoids = {}));
var FishyBoids;
(function (FishyBoids) {
    var FishGeometry = (function (_super) {
        __extends(FishGeometry, _super);
        function FishGeometry() {
            var _this = _super.call(this) || this;
            _this.vertices = [
                new THREE.Vector3(5, 0, 0),
                new THREE.Vector3(0, 3, 0),
                new THREE.Vector3(-4, 0, 0),
                new THREE.Vector3(-1, -2, 0),
                new THREE.Vector3(-6, 2, 0),
                new THREE.Vector3(-6, -2, 0),
                new THREE.Vector3(2, -0.5, 0),
                new THREE.Vector3(2, -1, 1.5),
                new THREE.Vector3(1, -1, 1.5),
                new THREE.Vector3(2, -0.5, 0),
                new THREE.Vector3(2, -1, -1.5),
                new THREE.Vector3(1, -1, -1.5),
            ];
            _this.faces = [
                new THREE.Face3(2, 0, 1),
                new THREE.Face3(2, 0, 3),
                new THREE.Face3(2, 4, 5),
                new THREE.Face3(6, 7, 8),
                new THREE.Face3(9, 10, 11),
            ];
            _this.computeFaceNormals();
            return _this;
        }
        FishGeometry.prototype.moveTail = function (newPos) {
            this.vertices[4].z = this.vertices[5].z = newPos;
        };
        FishGeometry.prototype.moveFins = function (newPos) {
            this.vertices[7].y =
                this.vertices[8].y =
                    this.vertices[10].y =
                        this.vertices[11].y =
                            newPos;
        };
        return FishGeometry;
    }(THREE.Geometry));
    FishyBoids.FishGeometry = FishGeometry;
})(FishyBoids || (FishyBoids = {}));
var FishyBoids;
(function (FishyBoids) {
    var Boid = (function () {
        function Boid(position, velocity) {
            if (position === void 0) { position = new THREE.Vector3(); }
            if (velocity === void 0) { velocity = new THREE.Vector3(); }
            this.neighbourRadius = 20;
            this.alignmentWeighting = 0.1;
            this.cohesionWeighting = 0.05;
            this.seperationWeighting = 0.1;
            this.viewAngle = 3.92;
            this.speed = 1;
            this.position = position;
            this.velocity = velocity;
        }
        Boid.prototype.update = function (boids) {
            var interaction = this.calcInteraction(boids);
            this.velocity.add(interaction);
            var avoidance = this.calcBoundsAvoidance();
            this.velocity.add(avoidance);
            if (this._avoidTarget != null) {
                var repulse = this.calcRepel(this._avoidTarget);
                this.velocity.add(repulse);
            }
            this.velocity.normalize();
            this.velocity.multiplyScalar(this.speed);
            this.position.add(this.velocity);
        };
        Boid.prototype.setBounds = function (width, height, depth) {
            this._boundsWidth = width;
            this._boundsHeight = height;
            this._boundsDepth = depth;
        };
        Boid.prototype.setAvoidTarget = function (target) {
            this._avoidTarget = target;
        };
        Boid.prototype.steer = function (target, weighting) {
            if (weighting === void 0) { weighting = 1; }
            var v = new THREE.Vector3();
            v.subVectors(target, this.position);
            v.multiplyScalar(weighting);
            this.velocity.add(v);
        };
        Boid.prototype.repulse = function (target, weighting) {
            if (weighting === void 0) { weighting = 1; }
            var v = new THREE.Vector3();
            v.subVectors(this.position, target);
            v.multiplyScalar(weighting);
            this.velocity.add(v);
        };
        Boid.prototype.calcRepel = function (target, maxDistance) {
            if (maxDistance === void 0) { maxDistance = 100; }
            var v = new THREE.Vector3();
            var distance = this.position.distanceTo(target);
            if (distance < maxDistance) {
                var forceWeighting = 5 / distance;
                v.subVectors(this.position, target);
                v.multiplyScalar(forceWeighting);
            }
            return v;
        };
        Boid.prototype.calcInteraction = function (boids) {
            var v = new THREE.Vector3();
            var alignment = new THREE.Vector3();
            var seperation = new THREE.Vector3();
            var cohesion = new THREE.Vector3();
            var repulse = new THREE.Vector3();
            var contributedCount = 0;
            var neighbour;
            for (var i = 0; i < boids.length; i++) {
                neighbour = boids[i];
                var distance = this.position.distanceTo(neighbour.position);
                var product = neighbour.velocity.dot(this.velocity);
                var angleBetween = Math.acos(product);
                if ((distance > 0 && distance < this.neighbourRadius) && angleBetween < this.viewAngle) {
                    repulse.subVectors(neighbour.position, this.position);
                    repulse.normalize();
                    repulse.divideScalar(distance);
                    alignment.add(neighbour.velocity);
                    cohesion.add(neighbour.position);
                    seperation.add(repulse);
                    contributedCount++;
                }
            }
            alignment.divideScalar(contributedCount);
            alignment.normalize();
            cohesion.divideScalar(contributedCount);
            cohesion.sub(this.position);
            cohesion.normalize();
            seperation.divideScalar(contributedCount);
            seperation.negate();
            seperation.normalize();
            v.add(alignment.multiplyScalar(this.alignmentWeighting));
            v.add(cohesion.multiplyScalar(this.cohesionWeighting));
            v.add(seperation.multiplyScalar(this.seperationWeighting));
            return v;
        };
        Boid.prototype.calcBoundsAvoidance = function () {
            var v = new THREE.Vector3();
            if (this.position.x < -this._boundsWidth)
                v.x = 1;
            if (this.position.x > this._boundsWidth)
                v.x = -1;
            if (this.position.y < -this._boundsHeight)
                v.y = 1;
            if (this.position.y > this._boundsHeight)
                v.y = -1;
            if (this.position.z < -this._boundsDepth)
                v.z = 1;
            if (this.position.z > this._boundsDepth)
                v.z = -1;
            return v;
        };
        return Boid;
    }());
    FishyBoids.Boid = Boid;
})(FishyBoids || (FishyBoids = {}));
var FishyBoids;
(function (FishyBoids) {
    var Predator = (function (_super) {
        __extends(Predator, _super);
        function Predator(position, velocity) {
            if (position === void 0) { position = new THREE.Vector3(); }
            if (velocity === void 0) { velocity = new THREE.Vector3(); }
            var _this = _super.call(this, position, velocity) || this;
            _this.speed = 1;
            return _this;
        }
        Predator.prototype.calcBoidInteraction = function (boid) {
            var distance = this.position.distanceTo(boid.position);
            if (distance <= 150) {
                var repulseWeighting = (1 / distance) * 15;
                boid.repulse(this.position, repulseWeighting);
                this.steer(boid.position, 0.0005);
                this.speed = 2;
                if (distance <= 5) {
                    this.speed = 1;
                    boid.position = new THREE.Vector3(Math.random() * this._boundsWidth - 10, Math.random() * this._boundsWidth - 10, Math.random() * this._boundsWidth - 10);
                }
            }
        };
        Predator.prototype.update = function () {
            var avoidance = this.calcBoundsAvoidance();
            this.velocity.add(avoidance.multiplyScalar(0.1));
            this.velocity.normalize();
            this.velocity.multiplyScalar(this.speed);
            this.position.add(this.velocity);
        };
        return Predator;
    }(FishyBoids.Boid));
    FishyBoids.Predator = Predator;
})(FishyBoids || (FishyBoids = {}));
var FishyBoids;
(function (FishyBoids) {
    var Renderer = (function () {
        function Renderer(domElement, w, h) {
            this.width = w;
            this.height = h;
            this.domElement = domElement;
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 10000);
            this.camera.setLens(35);
            this.backendRenderer = new THREE.WebGLRenderer();
            this.backendRenderer.setSize(window.innerWidth, window.innerHeight);
            this.backendRenderer.shadowMapEnabled = true;
            this.backendRenderer.shadowMapType = THREE.PCFSoftShadowMap;
            this.backendRenderer.setClearColor(0x13495E);
            this.domElement.appendChild(this.backendRenderer.domElement);
            var ambientLight = new THREE.AmbientLight(0xFFFFFF);
            this.scene.add(ambientLight);
            var directionalLight = new THREE.DirectionalLight(0xFFFFFF);
            directionalLight.position.set(1, 1, 1).normalize();
            this.scene.add(directionalLight);
            this.controls = new THREE.OrbitControls(this.camera, this.backendRenderer.domElement);
            this.camera.position.z = 1000;
        }
        Renderer.prototype.start = function () {
            this.render();
        };
        Renderer.prototype.render = function () {
            this.backendRenderer.render(this.scene, this.camera);
            this.controls.update();
        };
        Renderer.prototype.resize = function (w, h) {
            this.width = w;
            this.height = h;
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
            this.backendRenderer.setSize(this.width, this.height);
        };
        return Renderer;
    }());
    FishyBoids.Renderer = Renderer;
})(FishyBoids || (FishyBoids = {}));
var FishGeometry = FishyBoids.FishGeometry;
var FishMesh = FishyBoids.FishMesh;
var Boid = FishyBoids.Boid;
var Predator = FishyBoids.Predator;
var Renderer = FishyBoids.Renderer;
var renderer;
var FishyBoidsSim = (function () {
    function FishyBoidsSim() {
        this.boidsCount = 200;
        this.predatorOn = false;
        this.boids = new Array();
        this.boundsWidth = 600;
        this.boundsHeight = 400;
        this.boundsDepth = 400;
    }
    FishyBoidsSim.prototype.resetScene = function () {
        for (var i = 0; i < this.fishMeshes.length; i++) {
            renderer.scene.remove(this.fishMeshes[i]);
        }
        renderer.scene.remove(this.predatorMesh);
    };
    FishyBoidsSim.prototype.generate = function () {
        this.boids = new Array();
        this.fishMeshes = new Array();
        var boid;
        for (var i = 0; i < this.boidsCount; i++) {
            var position = new THREE.Vector3(Math.random() * this.boundsWidth - 10, Math.random() * this.boundsHeight - 10, Math.random() * this.boundsDepth - 10);
            var velocity = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
            boid = this.boids[i] = new Boid(position, velocity);
            boid.setBounds(this.boundsWidth, this.boundsHeight, this.boundsDepth);
            var baseColour = new THREE.Color(0xFF8600);
            this.fishMeshes[i] = new FishMesh(position, baseColour);
            renderer.scene.add(this.fishMeshes[i]);
        }
        if (this.predatorOn == true) {
            var predatorPosition = new THREE.Vector3(Math.random() * this.boundsWidth - 10, Math.random() * this.boundsHeight - 10, Math.random() * this.boundsDepth - 10);
            var predatorVelocity = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
            this.predator = new Predator(predatorPosition, predatorVelocity);
            this.predator.setBounds(this.boundsWidth, this.boundsHeight, this.boundsDepth);
            this.predatorMesh = new FishMesh(predatorPosition, new THREE.Color(0x438BB7));
            this.predatorMesh.scale.set(6, 6, 6);
            renderer.scene.add(this.predatorMesh);
        }
    };
    FishyBoidsSim.prototype.update = function () {
        var boid;
        var fishMesh;
        for (var i = 0; i < this.boids.length; i++) {
            boid = this.boids[i];
            boid.update(this.boids);
            if (this.predatorOn == true) {
                boid.setAvoidTarget(this.predator.position);
                this.predator.calcBoidInteraction(boid);
            }
            fishMesh = this.fishMeshes[i];
            fishMesh.position.copy(boid.position);
            fishMesh.rotation.y = Math.atan2(-boid.velocity.z, boid.velocity.x);
            fishMesh.rotation.z = Math.asin(boid.velocity.y / boid.velocity.length());
            fishMesh.animate();
        }
        if (this.predatorOn == true) {
            this.predator.update();
            this.predatorMesh.position.copy(this.predator.position);
            this.predatorMesh.rotation.y = Math.atan2(-this.predator.velocity.z, this.predator.velocity.x);
            this.predatorMesh.rotation.z = Math.asin(this.predator.velocity.y / this.predator.velocity.length());
            this.predatorMesh.animate();
        }
    };
    return FishyBoidsSim;
}());
var fishyBoids;
function init() {
    renderer = new Renderer(document.getElementById('content'), window.innerWidth, window.innerHeight);
    renderer.start();
    fishyBoids = new FishyBoidsSim();
    fishyBoids.generate();
    var gui = new dat.GUI();
    gui.add(fishyBoids, 'boidsCount', 0, 700).onFinishChange(onControlsChange);
    gui.add(fishyBoids, 'predatorOn').onFinishChange(onControlsChange);
    main();
}
function onControlsChange(value) {
    fishyBoids.resetScene();
    fishyBoids.generate();
}
function main() {
    fishyBoids.update();
    renderer.render();
    requestAnimationFrame(function () { return main(); });
}
window.onresize = function (e) {
    renderer.resize(window.innerWidth, window.innerHeight);
};
window.onload = function () {
    init();
};
//# sourceMappingURL=app.js.map