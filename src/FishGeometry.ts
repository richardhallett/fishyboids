namespace FishyBoids {

    /**
    * A geometry class for the makeup of a fish, with some helper methods.
    */
    export class FishGeometry extends THREE.Geometry {
        constructor() {
            super();

            this.vertices = [
                //Body
                new THREE.Vector3(5, 0, 0),
                new THREE.Vector3(0, 3, 0),
                new THREE.Vector3(-4, 0, 0),
                new THREE.Vector3(-1, -2, 0),

                // Tail
                new THREE.Vector3(-6, 2, 0),
                new THREE.Vector3(-6, -2, 0),

                // Left Fin
                new THREE.Vector3(2, -0.5, 0),
                new THREE.Vector3(2, -1, 1.5),
                new THREE.Vector3(1, -1, 1.5),

                // Right Fin
                new THREE.Vector3(2, -0.5, 0),
                new THREE.Vector3(2, -1, -1.5),
                new THREE.Vector3(1, -1, -1.5),
            ];

            this.faces = [
                new THREE.Face3(2, 0, 1),
                new THREE.Face3(2, 0, 3),
                new THREE.Face3(2, 4, 5),
                new THREE.Face3(6, 7, 8),
                new THREE.Face3(9, 10, 11),
            ]

            this.computeFaceNormals();
        }
    
        /**
        * Move both the tail vertices by specified amount.
        */
        public moveTail(newPos: number) {
            this.vertices[4].z = this.vertices[5].z = newPos;
        }

        /**
        * Move both the fins vertices by specified amount.
        */
        public moveFins(newPos: number) {
            this.vertices[7].y =
            this.vertices[8].y =
            this.vertices[10].y =
            this.vertices[11].y =
            newPos;
        }
    }
}