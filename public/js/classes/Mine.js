import Space from "./Space.js"
import MineMatrix from "./MineMatrix.js"
import ResourceController from "./ResourceController.js"
import * as THREE from 'three'


export default class Mine {

    constructor(gltfLoader, resourceController) {
        this.name = "Шахта";
        this.resourceController = resourceController;
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
        this.showInfo();
        // this.work();
    }

    showInfo(){
        const location_content = document.getElementById("location_content");

        const information = document.createElement("p");
        information.innerText = "Рабочих в шахте:";

        const workersCountParagraph = document.createElement("p");
        workersCountParagraph.id = "workers_count";
        workersCountParagraph.innerText = this.mineMatrix.workersCount;
        
        const addWorkerButton = document.createElement("button");
        addWorkerButton.onclick = () => {
            this.mineMatrix.setWorkersCount(this.mineMatrix.workersCount+1);
        };
        addWorkerButton.innerText = "+";

        const removeWorkerButton = document.createElement("button");
        removeWorkerButton.onclick = () => {
            this.mineMatrix.setWorkersCount(this.mineMatrix.workersCount-1);
        };
        removeWorkerButton.innerText = "-";

        location_content.append(information);
        location_content.append(workersCountParagraph);
        location_content.append(addWorkerButton);
        location_content.append(removeWorkerButton);
    }

    hide(){
        this.mineMatrix.stopShow();
        const location_content = document.getElementById("location_content");
        location_content.innerHTML = "";
    }

    work(){
        this.mineMatrix.work();
    }

}