namespace FishyBoids {

    export class Boid {
        public position: THREE.Vector3;
        public velocity: THREE.Vector3;

        neighbourRadius: number = 20; // Distance for what is considered a close neighbour
        alignmentWeighting: number = 0.1; // How much it should try to steer towards
        cohesionWeighting: number = 0.05; // How much it should try to stay together
        seperationWeighting: number = 0.1; // How much should it try to seperate
        viewAngle: number = 3.92; // The area the boid can see
        speed: number =  1; // Speed of the boid        

        // Bounds which this boid respects
        protected _boundsWidth: number;
        protected _boundsHeight: number;
        protected _boundsDepth: number;

        protected _avoidTarget: THREE.Vector3;

        constructor(
            position: THREE.Vector3 = new THREE.Vector3(),
            velocity: THREE.Vector3 = new THREE.Vector3()
            ) {
            this.position = position;
            this.velocity = velocity;
        }    

        /**
        * Update a boids position based upon calculating the various velocities
        */
        public update(boids: Array<Boid>) {

            var interaction = this.calcInteraction(boids);
            this.velocity.add(interaction);

            var avoidance = this.calcBoundsAvoidance();
            this.velocity.add(avoidance);

            if (this._avoidTarget != null) {
                var repulse = this.calcRepel(this._avoidTarget);
                this.velocity.add(repulse);
            }

            // Normalise
            this.velocity.normalize();
            // Add the speed back
            this.velocity.multiplyScalar(this.speed);

            // Update position based on velocity
            this.position.add(this.velocity);
        }    

        /**
        * Set the bounds this boid respects when moving.
        */
        public setBounds(width: number, height: number, depth: number) {
            this._boundsWidth = width;
            this._boundsHeight = height;
            this._boundsDepth = depth;
        }

        /**
        * Set the target boids should avoid
        */
        public setAvoidTarget(target: THREE.Vector3) {
            this._avoidTarget = target;
        }

        /**
        * Calculate a velocity to steer towards a target.
        */
        public steer(target: THREE.Vector3, weighting: number = 1) {
            var v = new THREE.Vector3();
            
            v.subVectors(target, this.position);
            v.multiplyScalar(weighting);

            this.velocity.add(v);
        }
        
        /**
        * Calculate a velocity to steer away from a target.
        */
        public repulse(target: THREE.Vector3, weighting: number = 1) {
            var v = new THREE.Vector3();

            v.subVectors(this.position, target);
            v.multiplyScalar(weighting);

            this.velocity.add(v);
        }

        /**
        * Calculate a velocity to steer away from a target.
        */
        protected calcRepel(target: THREE.Vector3, maxDistance: number = 100) {
            var v = new THREE.Vector3();

            var distance = this.position.distanceTo(target);

            if (distance < maxDistance) {
                var forceWeighting = 5 / distance; // Repel force is based upon distance, so closer we are the more we repel
                v.subVectors(this.position, target);
                v.multiplyScalar(forceWeighting);
            }

            return v;
        }

        /**
        * Calculate flocking algorithm interactions between this boid and it's neighbours
        */
        private calcInteraction(boids: Array<Boid>): THREE.Vector3 {
            var v = new THREE.Vector3();

            var alignment = new THREE.Vector3();
            var seperation = new THREE.Vector3();
            var cohesion = new THREE.Vector3();
            var repulse = new THREE.Vector3();

            var contributedCount: number = 0; // The number of neighbours that contributed to the new velocity.
        
            var neighbour: Boid;
            for (var i = 0; i < boids.length; i++) {
                neighbour = boids[i];

                var distance = this.position.distanceTo(neighbour.position);
                var product = neighbour.velocity.dot(this.velocity);
                var angleBetween = Math.acos(product);

                if ((distance > 0 && distance < this.neighbourRadius) && angleBetween < this.viewAngle) {                
                    // Calculate the difference between this position and the neighbours to get a vector pointing away
                    repulse.subVectors(neighbour.position, this.position);
                    repulse.normalize();
                    repulse.divideScalar(distance); // Weighted by the distance between neighbour and this

                    // Alignment is the sum of the neighbouring velocity, we'll average this later
                    alignment.add(neighbour.velocity);

                    // Add all the neighbours positions for later averaging to get cohesion.
                    cohesion.add(neighbour.position);

                    // Seperation is the sum of vectors pointing away from the neighbours
                    seperation.add(repulse);

                    contributedCount++;
                }
            }
          
            // Alignment is the average of the neighbouring velocitys
            alignment.divideScalar(contributedCount);
            alignment.normalize();            

            // Cohesion is the average position to steer towards.
            cohesion.divideScalar(contributedCount);
            cohesion.sub(this.position);
            cohesion.normalize();

            // Seperation is the average direction to steer away
            seperation.divideScalar(contributedCount);
            seperation.negate();
            seperation.normalize();

            v.add(alignment.multiplyScalar(this.alignmentWeighting));
            v.add(cohesion.multiplyScalar(this.cohesionWeighting));
            v.add(seperation.multiplyScalar(this.seperationWeighting));            

            return v;
        }    

        /**
        * Calculates avoidance of the bounding box, just provides a reverse direction.
        */
        protected calcBoundsAvoidance(): THREE.Vector3 {
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
        }
    }
}