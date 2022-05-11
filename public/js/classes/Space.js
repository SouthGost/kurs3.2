import * as THREE from 'three';
import { GLTFLoader } from '../../jsm/loaders/GLTFLoader.js';
import Mine from "./Mine.js";
import { OrbitControls } from '../../jsm/controls/OrbitControls.js';

export default class Space {
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.canvas.setAttribute('width', this.width + "");
        this.canvas.setAttribute('height', this.height + "");
        this.renderer.setSize(this.width, this.height, false);

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }

    show() {
        this.loop()
    }



    constructor(canvas_name) {
        this.canvas = document.getElementById(canvas_name);
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.setAttribute('width', this.width + "");
        this.canvas.setAttribute('height', this.height + "");
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(90, this.width / this.height, 1, 1000)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        const init = () => {
            console.log("init space");
            this.show()
            this.locations[0].visible(this.renderer, this.scene, this.camera);
        }

        this.manager = new THREE.LoadingManager();

        this.manager.onLoad = init;
        
        this.gltfLoader = new GLTFLoader(this.manager);
        this.locations = [
            new Mine(this.gltfLoader),
        ];

        window.addEventListener('resize', this.resize);
    }

    loop() {
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(() => { this.loop(); });
    }

    //renderer.setClearColor(0x20B2AA);  this.
    //camera.position.set(10, 10, 10);
    //scene.add(light);

    // продумать рендер лууп
}