import Space from "./Space.js";
import MineMatrix from "./MineMatrix.js";
import ResourceController from "./ResourceController.js";
import * as THREE from 'three';


export default class Mine {

    constructor(gltfLoader, resourceController, htmlController) {
        this.name = "Шахта";
        this.resourceController = resourceController;
        this.htmlController = htmlController;
        this.mineMatrix = new MineMatrix(this.resourceController);
        this.objects3d = [
            new THREE.HemisphereLight(0xFFE4B5, 0x000000, 1),
        ];
        gltfLoader.load(`/models/location/Mine.glb`, (gltf) => {
            const root = gltf.scene;
            root.position.set(6, -2, 26);
            this.objects3d.push(root);
        });
        gltfLoader.load(`/models/miner/scene.gltf`, (gltf) => {
            const root = gltf.scene;
            root.position.set(0, 0, 4);
            this.objects3d.push(root);
        });
    }


    visible(renderer, scene, camera, mixers) {
        renderer.setClearColor(0x000000);
        camera.position.set(10, 10, 10);
        camera.lookAt(0, 0, 0);
        for (const object_ of this.objects3d) {
            scene.add(object_);
        }
        this.mineMatrix.show(scene);
        this.showInfo();
    }

    showInfo() {
        const informationParagraph = document.createElement("p");
        informationParagraph.innerText = "Рабочих в шахте:";

        const workersCountParagraph = document.createElement("p");
        workersCountParagraph.id = "workers_count";
        workersCountParagraph.innerText = this.mineMatrix.workers.length;

        const addWorkerButton = document.createElement("button");
        addWorkerButton.onclick = () => {
            try {
                this.mineMatrix.addWorker(this.resourceController.getFreeWorker());
            } catch (error) {
                this.htmlController.notifyMessage(error.message);
            }
        };
        addWorkerButton.innerText = "+";

        const removeWorkerButton = document.createElement("button");
        removeWorkerButton.onclick = () => {
            try {
                this.mineMatrix.removeWorker();
            } catch (error) {
                this.htmlController.notifyMessage(error.message);
            }
        };
        removeWorkerButton.innerText = "-";

        this.htmlController.showLocationContent([
            informationParagraph,
            workersCountParagraph,
            addWorkerButton,
            removeWorkerButton,
        ]);
    }

    hide() {
        this.mineMatrix.stopShow();
    }

    work() {
        this.mineMatrix.work();
    }

}