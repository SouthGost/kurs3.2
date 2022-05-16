import * as THREE from 'three';
import { GLTFLoader } from '../../jsm/loaders/GLTFLoader.js';
import Mine from "./Mine.js";
import Global from './Global.js';
import Modal from './Modal.js';
import ResourceController from "./ResourceController.js";
import { OrbitControls } from '../../jsm/controls/OrbitControls.js';

export default class Space {
    resize = () => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.currentLocationId = undefined;

        this.canvas.setAttribute('width', this.width + "");
        this.canvas.setAttribute('height', this.height + "");
        this.renderer.setSize(this.width, this.height, false);

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }

    show() {
        this.loop()
    }

    visibleLocation(i) {
        if (i < 0 || i >= this.locations.length) {
            throw new Error("Неизвесная локация");
        }
        if (this.currentLocationId != i) {
            if (this.currentLocationId != undefined) {
                this.locations[this.currentLocationId].hide();
            }
            this.scene.clear();
            if (this.mixers.length > 0) {
                this.mixers.splice(0, this.mixers.length);
            }
            this.locations[i].visible(
                this.renderer,
                this.scene,
                this.camera,
                this.mixers
            );
            this.currentLocationId = i;
        }
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
        this.clock = new THREE.Clock();
        this.delta;
        this.mixers = [];

        const init = () => {
            console.log("init space");
            this.show();
            this.visibleLocation(1);
            const locationsContent = document.getElementById("location_selection");

            for (let i = 0; i < this.locations.length; i++) {
                const button = document.createElement("button");
                button.innerText = this.locations[i].name;
                button.onclick = () => {
                    this.visibleLocation(i);
                }
                locationsContent.append(button);
            }
            this.locations[0].work();
        }

        this.manager = new THREE.LoadingManager();

        this.manager.onLoad = init;

        this.gltfLoader = new GLTFLoader(this.manager);
        this.resourceController = new ResourceController(this.gltfLoader);
        this.locations = [
            new Mine(this.gltfLoader, this.resourceController),
            new Global(this.gltfLoader, this.resourceController),
        ];

        //----место для html редактора
        this.modal = new Modal();

        window.addEventListener('resize', this.resize);
    }

    loop() {
        this.delta = this.clock.getDelta();
        for (const mixer of this.mixers) {
            mixer.update(this.delta);
        }

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => { this.loop(); });
    }

    //renderer.setClearColor(0x20B2AA);  this.
    //camera.position.set(10, 10, 10);
    //scene.add(light);

    // продумать рендер лууп
}