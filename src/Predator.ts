
namespace FishyBoids {
    
    /**
    * Predator specific implementation of a boid
    */
    export class Predator extends Boid {        
        constructor(
            position: THREE.Vector3 = new THREE.Vector3(),
            velocity: THREE.Vector3 = new THREE.Vector3()
        ) {
            super(position, velocity);
            this.speed = 1;
        }
        
        public calcBoidInteraction(boid: Boid) {
            var distance = this.position.distanceTo(boid.position);

            if (distance <= 150) {
                var repulseWeighting = (1 / distance) * 15;
                // boids avoid
                boid.repulse(this.position, repulseWeighting);
                
                // Chase towards nearest boid
                this.steer(boid.position, 0.0005);
                this.speed = 2;        
        
                // Check if we've caught up
                if (distance <= 5) {
                    this.speed = 1; // Reset speed
                    
                    // Boid "dies" when caught so respawn it to a new location
                    boid.position = new THREE.Vector3(
                        Math.random() * this._boundsWidth - 10,
                        Math.random() * this._boundsWidth - 10,
                        Math.random() * this._boundsWidth - 10
                    );
                }
            }
        }
    
        /**
        * Calculate predator boids position based on velocity
        */
        public update() {               
    
            // Bounds avoidance
            var avoidance = this.calcBoundsAvoidance();
            this.velocity.add(avoidance.multiplyScalar(0.1));
    
            // Normalise
            this.velocity.normalize();
            // Add the speed back
            this.velocity.multiplyScalar(this.speed);
    
            // Update position based on velocity
            this.position.add(this.velocity);
        }    
    
    }

}