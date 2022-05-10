import Space from "./Space.js"
import MineMatrix from "./MineMatrix.js"
import ResourceController from "./ResourceController.js"
import * as THREE from 'three'
import { OrbitControls } from '../../jsm/controls/OrbitControls.js';

export default class Mine extends Space {

    constructor(canvas_name) {
        super(canvas_name)
        this.renderer.setClearColor(0x000000);
        this.camera.position.set(10, 10, 10);
        this.light = new THREE.HemisphereLight(0xFFE4B5, 0x000000, 1);
        this.scene.add(this.light);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.isInited = false;
        this.manager.onLoad = this.init;

        this.resourceController = new ResourceController(this.gltfLoader);
        this.gltfLoader.load(`/models/location/Galerie.glb`, (gltf) => {
            const root = gltf.scene;
            root.position.set(6, -2, 26);
            this.scene.add(root);
        });
        this.gltfLoader.load(`/models/miner/scene.gltf`, (gltf) => {
            const root = gltf.scene;
            root.position.set(0, 0, 4)
            this.scene.add(root);
        });
    }

    loop = () => {
        this.renderer.render(this.scene, this.camera);

        if (this.isShow) {
            requestAnimationFrame(() => { this.loop(); });
        }
    }

    init = () => {
        console.log("Загрузил");
        this.mineMatrix = new MineMatrix(this.scene, this.resourceController);
        this.show();
        this.work();
    }

    work = () => {
        this.mineMatrix.work();
    }

}