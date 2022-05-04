import * as THREE from 'three'
import { GLTFLoader } from '../../jsm/loaders/GLTFLoader.js';
// import { GLTFLoader } from '../simple.js';

export default class Space {


    resize = () => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.canvas.setAttribute('width', this.width + "");
        this.canvas.setAttribute('height', this.height + "");
        this.renderer.setSize(this.width, this.height, false);

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }

    show() {
        this.isShow = true;
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
        this.manager = new THREE.LoadingManager();
        this.gltfLoader = new GLTFLoader(this.manager);
        this.isShow = false;
        this.light = new THREE.HemisphereLight(0xFFFFFF, 0x000000, 1);
        window.addEventListener('resize', this.resize);
    }
    
    loop = () => { }
    
    //renderer.setClearColor(0x20B2AA);  this.
    //camera.position.set(10, 10, 10);
    //scene.add(light);

    // продумать рендер лууп
}