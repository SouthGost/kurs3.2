import * as THREE from 'three';

export default class TradeLocation {


    constructor(gltfLoader, resourceController, htmlController) {
        this.name = "Торговля"
        this.resourceController = resourceController;
        this.htmlController = htmlController;
        const dirLight = new THREE.DirectionalLight(0x55505a, 1);
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

        this.objects3d = [
            new THREE.HemisphereLight(0xFFE4B5, 0x000000, 1),
            dirLight,
        ];
        this.mixers = [];
        this.actions = [];
        gltfLoader.load(`/models/hoist_full/hoist.glb`, (gltf) => {
            const hoist = gltf.scene;
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
    }

    visible(renderer, scene, camera, mixers) {
        renderer.setClearColor(0x00FFFF);
        camera.position.set(0, 40, 15);
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
            const ModalElements = [];
            const saleResources = [];
            for (const resource of this.resourceController.resources) {
                const saleResource_ = {
                    resource: resource,
                    number: 0
                }
                saleResources.push(saleResource_);

                const resourceLine = document.createElement("div");
                resourceLine.className = "row"
    
                const numberResource = document.createElement("p");
                numberResource.innerText = "0";

                const costSaleResource = document.createElement("p");
                costSaleResource.innerText = "0";

                const nameResource = document.createElement("p");
                nameResource.innerText = resource.name;
    
                const addSaleResourceButton = document.createElement("button");
                addSaleResourceButton.onclick = () => {
                    try {
                        if(saleResource_.number + 1 <= resource.count){
                            saleResource_.number = saleResource_.number + 1;
                            numberResource.innerText = saleResource_.number;
                            costSaleResource.innerText = resource.cost * (saleResource_.number);
                        }else{
                            throw new Error("Не достаточно ресурсов");
                        }
                    } catch (error) {
                        this.htmlController.notifyMessage(error.message);
                    }
                };
                addSaleResourceButton.innerText = "+";
    
                const removeSaleResourceButton = document.createElement("button");
                removeSaleResourceButton.onclick = () => {
                    try {
                        if(saleResource_.number - 1 >= 0){
                            saleResource_.number = saleResource_.number - 1;
                            numberResource.innerText = saleResource_.number;
                            costSaleResource.innerText = resource.cost * (saleResource_.number);
                        }else{
                            throw new Error("Нельзя продавать отрицательное значение ресурсов");
                        }
                    } catch (error) {
                        this.htmlController.notifyMessage(error.message);
                    }
                };
                removeSaleResourceButton.innerText = "-";
    
                resourceLine.append(numberResource);
                resourceLine.append(nameResource);
                resourceLine.append(addSaleResourceButton);
                resourceLine.append(removeSaleResourceButton);
                resourceLine.append(costSaleResource);
                ModalElements.push(resourceLine);

            }
            const saleButton = document.createElement("button");
            saleButton.innerText = "продать ресурсы";
            saleButton.onclick = () => {
                try{
                    for (const saleResource_ of saleResources) {
                        saleResource_.resource.changeCount(-saleResource_.number);
                        this.resourceController.addMoney(saleResource_.resource.cost * saleResource_.number);
                        saleResource_.number = 0;
                        // сделано убого
                    }
                }catch(error){
                    this.htmlController.notifyMessage(error.message);
                }
            }
            ModalElements.push(saleButton);

            this.htmlController.openModal("Управление ресурсами", ModalElements);
        }

        this.htmlController.showLocationContent([manageResourceButton]);
    }

}