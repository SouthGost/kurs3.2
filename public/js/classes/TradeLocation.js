import * as THREE from 'three';
import ResourceImprove from "./ResourceImprove.js";


export default class TradeLocation {


    constructor(gltfLoader, resourceController, htmlController) {
        this.name = "Фабрика"
        this.resourceController = resourceController;
        this.resourceImprove = new ResourceImprove(resourceController, htmlController);
        this.htmlController = htmlController;
        const dirLight = new THREE.DirectionalLight(0x55505a, 1);
        dirLight.position.set(0, 30, 40);
        dirLight.castShadow = true;
        // dirLight.shadow.camera.near = 1;
        // dirLight.shadow.camera.far = 10;

        // dirLight.shadow.camera.right = 1;
        // dirLight.shadow.camera.left = - 1;
        // dirLight.shadow.camera.top = 1;
        // dirLight.shadow.camera.bottom = - 1;

        // dirLight.shadow.mapSize.width = 1024;
        // dirLight.shadow.mapSize.height = 1024;

        this.objects3d = [
            // new THREE.AmbientLight(0xffffff, 0.5),
            new THREE.HemisphereLight(0xffffff, 0xFFFFE0, 0.6),
            dirLight,
        ];
        this.mixers = [];
        this.actions = [];
        this.vanAction = undefined;
        gltfLoader.load(`/models/hoist_full/hoist.glb`, (gltf) => {
            const hoist = gltf.scene;
            hoist.position.set(-50, 0, -25);
            // hoist.name = 'hoist'
            for (const animation_ of gltf.animations) {
                const objectName = animation_.name.split(".")[0];
                const animatedObject = hoist.getObjectByName(objectName)
                const mixer = new THREE.AnimationMixer(animatedObject);

                this.mixers.push(mixer);
                const action = mixer.clipAction(animation_);

                this.actions.push(action);
            }
            this.objects3d.push(hoist);
        });
        gltfLoader.load(`/models/location/Factory.glb`, (gltf) => {
            const root = gltf.scene;
            this.objects3d.push(root);
        });
        gltfLoader.load(`/models/Factory/Van.glb`, (gltf) => {
            const root = gltf.scene;

            root.name = 'van';

            const times = [0, 5];
            const values = [
                0, 0, 0,
                -100, 0, 0
            ];
            const vanMove_KF = new THREE.VectorKeyframeTrack('van.position', times, values);
            const vanMove_animation = new THREE.AnimationClip('van.position_animation', -1, [vanMove_KF]);
            const mixer = new THREE.AnimationMixer(root);
            this.mixers.push(mixer);
            this.vanAction = mixer.clipAction(vanMove_animation);

            this.vanAction.setLoop(THREE.LoopOnce);
            this.vanAction.clampWhenFinished = false;

            this.objects3d.push(root);
        });
    }

    visible(renderer, scene, camera, mixers) {
        this.htmlController.setBackgroundColor("rgba(0, 0, 0, 0.3)");
        const header = document.getElementById("header");
        // header.style.color = "white";

        renderer.setClearColor(0x00FFFF);
        camera.position.set(-10, 30, 35);
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

    hide() {
        for (const action of this.actions) {
            action.stop();
        }
    }

    showInfo() {
        const manageResourceButton = document.createElement("button");
        manageResourceButton.innerText = "Управление ресурсами";
        manageResourceButton.onclick = () => {
            const saleButton = document.createElement("button");
            saleButton.innerText = "Продать ресурсы";
            saleButton.onclick = () => {
                try {
                    let isSale = false;
                    for (const resource of this.resourceController.resources) {
                        if (resource.countForSale != 0) {
                            this.resourceController.removeResource(resource, resource.countForSale);
                            this.resourceController.addMoney(resource.cost * resource.countForSale);
                            isSale = true;
                            resource.clearCountForSale();
                        }
                        if(isSale){
                            this.vanAction.stop();
                            this.vanAction.play();
                        }
                    }
                } catch (error) {
                    this.htmlController.notifyMessage(error.message);
                }
            }

            this.htmlController.openModal(
                "Управление ресурсами",
                [
                    this.resourceController.seleTable(),
                    saleButton
                ]
            );
        }

        const manageImproveButton = document.createElement("button");
        manageImproveButton.innerText = "Обработка ресурсов";
        manageImproveButton.onclick = () => {

            this.htmlController.openModal(
                "Обработка ресурсов",
                this.resourceImprove.showImproveInfo(),
            )
        }

        this.htmlController.showLocationContent([manageResourceButton, manageImproveButton]);
    }

}