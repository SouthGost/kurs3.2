import * as THREE from 'three';
import Worker from './Worker.js';
import ResourceImprove from "./ResourceImprove.js";

export default class MainLocation {

    constructor(gltfLoader, resourceController, htmlController) {
        this.name = "База";
        this.resourceController = resourceController;
        this.htmlController = htmlController;
        this.resourceImprove = new ResourceImprove(htmlController);

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
        const header = document.getElementById("header");
        header.style.color = "white";

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

    showModal() {
        this.htmlController.openModal(
            "Обработка ресурсов",
            this.resourceImprove.showImproveInfo(),
        )
    }
    
    showInfo() {
        const manageWorkerButton = document.createElement("button");
        manageWorkerButton.innerText = "Обработка ресурсов";
        manageWorkerButton.onclick = () => {
            this.showModal();
        }

        this.htmlController.showLocationContent([manageWorkerButton]);
    }

    hide() {
        for (const action of this.actions) {
            action.stop();
        }
    }
}