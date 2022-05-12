import Space from "./Space.js"
import MineMatrix from "./MineMatrix.js"
import ResourceController from "./ResourceController.js"
import * as THREE from 'three'


export default class Mine {

    constructor(gltfLoader) {
        this.name = "Шахта";
        this.resourceController = new ResourceController(gltfLoader);
        this.mineMatrix = new MineMatrix( this.resourceController);
        this.objects3d = [
            new THREE.HemisphereLight(0xFFE4B5, 0x000000, 1),
        ];
        gltfLoader.load(`/models/location/Galerie.glb`, (gltf) => {
            const root = gltf.scene;
            root.position.set(6, -2, 26);
            this.objects3d.push(root);
            // this.scene.add(root);
        });
        gltfLoader.load(`/models/miner/scene.gltf`, (gltf) => {
            const root = gltf.scene;
            root.position.set(0, 0, 4);
            this.objects3d.push(root);
            // this.scene.add(root);
        });
    }

    // init(){

    // }

    visible(renderer, scene, camera, mixers) {
        renderer.setClearColor(0x000000);
        camera.position.set(10, 10, 10);
        camera.lookAt(0,0,0);
        for (const object_ of this.objects3d) {
            scene.add(object_);
        }
        this.mineMatrix.show(scene);
        // this.work();
    }

    hide(){
        this.mineMatrix.stopShow();
    }

    work(){
        this.mineMatrix.work();
    }

}