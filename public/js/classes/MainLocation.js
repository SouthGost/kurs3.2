import * as THREE from 'three';
import Worker from './Worker.js';

export default class Global {

    constructor(gltfLoader, resourceController, htmlController) {
        this.name = "База";
        this.resourceController = resourceController;
        this.htmlController = htmlController;

        const dirLight = new THREE.DirectionalLight(0xFFFFE0, 0.4);
        dirLight.position.set(0, 100, 40);
        dirLight.castShadow = true;
        dirLight.shadow.camera.near = 1;
        dirLight.shadow.camera.far = 10;

        dirLight.shadow.camera.right = 1;
        dirLight.shadow.camera.left = - 1;
        dirLight.shadow.camera.top = 1;
        dirLight.shadow.camera.bottom = - 1;

        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;


        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xFFFFE0, 0.6);
        hemiLight.position.set(0, 50, 0);

        const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);

        const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);

        this.objects3d = [
            hemiLight,
            hemiLightHelper,
            dirLight,
            dirLightHelper
        ];
        this.mixers = [];
        this.actions = [];
        gltfLoader.load(`/models/location/MainLocation.glb`, (gltf) => {
            const root = gltf.scene;
            console.log(gltf)
            this.objects3d.push(root);
        });
    }

    visible(renderer, scene, camera, mixers) {
        renderer.setClearColor(0x00FFFF);
        camera.position.set(-150, 80, 15);
        camera.lookAt(0, 0, 0);
        for (const object_ of this.objects3d) {
            scene.add(object_);
        }

        for (const mixer of this.mixers) {
            mixers.push(mixer);
        }
        for (const action of this.actions) {
            action.play();
        }
        this.showInfo();
    }
    
    showInfo() {
        const manageWorkerButton = document.createElement("button");
        manageWorkerButton.innerText = "Управление рабочими";
        manageWorkerButton.onclick = () => {
            const paragraph = document.createElement("p");
            paragraph.innerText = "Рабочих всего";

            const workersParagraph = document.createElement("p");
            workersParagraph.innerText = this.resourceController.getWorkersInfo();

            const hireWorkerButton = document.createElement("button");
            hireWorkerButton.onclick = () => {
                try {
                    const worker = new Worker();
                    this.resourceController.removeMoney(worker.cost);
                    this.resourceController.addWorker(worker);
                    workersParagraph.innerText = this.resourceController.getWorkersInfo();
                } catch (error) {
                    this.htmlController.notifyMessage(error.message);
                }
            }
            hireWorkerButton.innerText = "Нанять рабочего";

            const dismissWorkerButton = document.createElement("button");
            dismissWorkerButton.onclick = () => {
                try {
                    this.resourceController.removeWorker();
                    workersParagraph.innerText = this.resourceController.getWorkersInfo();
                } catch (error) {
                    this.htmlController.notifyMessage(error.message);
                }
            }
            dismissWorkerButton.innerText = "Уволить рабочего";

            this.htmlController.openModal(
                "Управление рабочими",
                [
                    paragraph,
                    workersParagraph,
                    hireWorkerButton,
                    dismissWorkerButton
                ]
            )
        }

        this.htmlController.showLocationContent([manageWorkerButton]);
    }

    hide() {
        for (const action of this.actions) {
            action.stop();
        }
    }
}