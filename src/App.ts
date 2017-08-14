/// <reference path="FishMesh.ts"/>
/// <reference path="FishGeometry.ts"/>
/// <reference path="Boid.ts"/>
/// <reference path="Predator.ts"/>
/// <reference path="Renderer.ts"/>

import FishGeometry = FishyBoids.FishGeometry;
import FishMesh = FishyBoids.FishMesh;
import Boid = FishyBoids.Boid;
import Predator = FishyBoids.Predator;
import Renderer = FishyBoids.Renderer;

var renderer: Renderer;

class FishyBoidsSim {

    public boidsCount:Number = 200;
    public predatorOn:boolean = false;

    boids: Array<Boid> = new Array<Boid>();
    fishMeshes: Array<FishMesh>;
    predator: Predator;
    predatorMesh: FishMesh;

    boundsWidth: number = 600;
    boundsHeight: number = 400;
    boundsDepth: number = 400;

    public resetScene() {
        // Go through and remove any previous meshes in the scene before generating
        for (var i = 0; i < this.fishMeshes.length; i++) {
            renderer.scene.remove(this.fishMeshes[i]);
        }

        // Remove predator
        renderer.scene.remove(this.predatorMesh);
    }

    public generate() {
        // Generate a flocking set of fish
        this.boids = new Array<Boid>();
        this.fishMeshes = new Array<FishMesh>();

        var boid: Boid;
        for (var i = 0; i < this.boidsCount; i++) {

            var position = new THREE.Vector3(
                Math.random() * this.boundsWidth - 10,
                Math.random() * this.boundsHeight - 10,
                Math.random() * this.boundsDepth - 10
                );

            var velocity = new THREE.Vector3(
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
                Math.random() * 2 - 1
                );

            // New boid
            boid = this.boids[i] = new Boid(position, velocity);
            boid.setBounds(this.boundsWidth, this.boundsHeight, this.boundsDepth);

            // Random Colour
            var baseColour = new THREE.Color(0xFF8600);

            // Create the mesh for the boid
            this.fishMeshes[i] = new FishMesh(position, baseColour);
            renderer.scene.add(this.fishMeshes[i]);
        }

        if (this.predatorOn == true) {
            // Create a predator to hunt the boids
            var predatorPosition = new THREE.Vector3(
                Math.random() * this.boundsWidth - 10,
                Math.random() * this.boundsHeight - 10,
                Math.random() * this.boundsDepth - 10
            );
            var predatorVelocity = new THREE.Vector3(
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
                Math.random() * 2 - 1
            );

            this.predator = new Predator(predatorPosition, predatorVelocity);
            this.predator.setBounds(this.boundsWidth, this.boundsHeight, this.boundsDepth);
            this.predatorMesh = new FishMesh(predatorPosition, new THREE.Color(0x438BB7));
            this.predatorMesh.scale.set(6, 6, 6);
            renderer.scene.add(this.predatorMesh);
        }
    }

    public update() {
         // Update all the boids
        var boid: Boid;
        var fishMesh: FishMesh;
        for (var i = 0; i < this.boids.length; i++) {

            // Do boid calculations
            boid = this.boids[i];
            boid.update(this.boids);

            // Calculate predator interaction
            if (this.predatorOn == true) {
                boid.setAvoidTarget(this.predator.position);
                this.predator.calcBoidInteraction(boid);
            }

            // Set the position/rotation of the mesh based on boid
            fishMesh = this.fishMeshes[i];
            fishMesh.position.copy(boid.position);

            // Rotate fish to look in it's velocity direction
            fishMesh.rotation.y = Math.atan2(- boid.velocity.z, boid.velocity.x);
            fishMesh.rotation.z = Math.asin(boid.velocity.y / boid.velocity.length());

            // Individual animation
            fishMesh.animate();
        }

        if (this.predatorOn == true) {
            // Update the predator
            this.predator.update();

            // Set the position/rotation of the predator mesh based on predator position
            this.predatorMesh.position.copy(this.predator.position);

            // Rotate fish to look in it's velocity direction
            this.predatorMesh.rotation.y = Math.atan2(- this.predator.velocity.z, this.predator.velocity.x);
            this.predatorMesh.rotation.z = Math.asin(this.predator.velocity.y / this.predator.velocity.length());

            // Animate the predator
            this.predatorMesh.animate();
        }
    }
}

var fishyBoids: FishyBoidsSim;

function init() {
    renderer = new Renderer(document.getElementById('content'),
        window.innerWidth,
        window.innerHeight);
    renderer.start();

    // The main application code
    fishyBoids = new FishyBoidsSim();
    // Initial generation
    fishyBoids.generate();

    // Gui to control simulation
    var gui = new dat.GUI();
    gui.add(fishyBoids, 'boidsCount', 0, 700).onFinishChange(onControlsChange);
    gui.add(fishyBoids, 'predatorOn').onFinishChange(onControlsChange);

    // Now fire off the main loop
    main();
}

function onControlsChange(value:Number) {
    // If we change this reset the scene and regenerate.
    fishyBoids.resetScene();
    fishyBoids.generate();
}

function main() {

    // Update the simulation.
    fishyBoids.update();

    // Update the renderer
    renderer.render();

    requestAnimationFrame(() => main());
}

window.onresize = (e: UIEvent) => {
    renderer.resize(window.innerWidth, window.innerHeight);
}

window.onload = () => {
    init();
};