namespace FishyBoids {
    export class Renderer {
        public backendRenderer: THREE.WebGLRenderer;
        public scene: THREE.Scene;
        public camera: THREE.PerspectiveCamera;

        private controls: THREE.OrbitControls;
        private domElement: HTMLElement;

        private width: number;
        private height: number;

        constructor(domElement: HTMLElement, w: number, h: number) {
            this.width = w;
            this.height = h;

            this.domElement = domElement;

            // Initial renderer set up
            this.scene = new THREE.Scene();

            this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 10000);
            this.camera.setLens(35);

            this.backendRenderer = new THREE.WebGLRenderer();
            this.backendRenderer.setSize(window.innerWidth, window.innerHeight);

            this.backendRenderer.shadowMapEnabled = true;
            this.backendRenderer.shadowMapType = THREE.PCFSoftShadowMap;

            this.backendRenderer.setClearColor(0x13495E);
            
            this.domElement.appendChild(this.backendRenderer.domElement);

            // Lighting
            var ambientLight = new THREE.AmbientLight(0xFFFFFF);
            this.scene.add(ambientLight);

            var directionalLight = new THREE.DirectionalLight(0xFFFFFF);
            directionalLight.position.set(1, 1, 1).normalize();
            this.scene.add(directionalLight);

            // Cmaera controls
            this.controls = new THREE.OrbitControls(this.camera, this.backendRenderer.domElement);
            this.camera.position.z = 1000;
        }

        start() {
            this.render();
        }

        render() {
            this.backendRenderer.render(this.scene, this.camera);
            this.controls.update();
        }

        resize(w: number, h: number) {
            this.width = w;
            this.height = h;

            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();

            this.backendRenderer.setSize(this.width, this.height);
        }
    }
}