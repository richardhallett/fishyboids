namespace FishyBoids {

    /**
    * Represents a fish in the world
    */
    export class FishMesh extends THREE.Mesh {
        geometry: FishGeometry;
        material: THREE.Material;
        animStep: number = 0;

        constructor(
            position: THREE.Vector3 = new THREE.Vector3(),
            baseColour: THREE.Color = new THREE.Color()
            ) {
            super();

            this.position = position;
            this.geometry = new FishGeometry();    
            this.material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, vertexColors: THREE.FaceColors });           
            
            // Body Colour
            this.geometry.faces[0].color.set(baseColour);
            this.geometry.faces[1].color.set(baseColour);

            // Tail colour
            this.geometry.faces[2].color.setRGB(baseColour.r - 0.4, baseColour.g - 0.4, baseColour.b - 0.4);

            // Fin Colour
            var finColour: THREE.Color = new THREE.Color(baseColour.r - 0.3, baseColour.g - 0.3, baseColour.b - 0.3);
            this.geometry.faces[3].color.set(finColour);
            this.geometry.faces[4].color.set(finColour);
        }

        public animate(speed: number = 0.2) {
            // Calculate new tail position over sine wave
            var newTailPos = Math.sin(this.animStep) * 0.6;
            var newFinPos = Math.sin(this.animStep) * 0.4 - 1;

            this.geometry.moveTail(newTailPos);
            this.geometry.moveFins(newFinPos);
            this.geometry.verticesNeedUpdate = true;

            this.animStep = (this.animStep + speed + this.rotation.z) % (Math.PI * 2)
        }
    }
}