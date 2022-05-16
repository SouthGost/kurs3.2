import * as THREE from 'three';

export default class Global {

    constructor(gltfLoader, resourceController) {
        this.name = "База";
        this.resourceController = resourceController;
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

    showInfo(){
        const location_content = document.getElementById("location_content");

        const manageWorkerButton = document.createElement("button");
        manageWorkerButton.onclick = () =>{
            const modal = document.getElementById("modal");
            const modalName = document.getElementById("modal_name");
            const modalContent = document.getElementById("modal_content");
            
            modalName.innerText = "Управление рабочими";
            
            const paragraph = document.createElement("p");
            paragraph.innerText = "Рабочих всего";

            const allWorkersParagraph = document.createElement("p");
            allWorkersParagraph.innerText = this.resourceController.workers.length;

            const hireWorkerButton = document.createElement("button");
            hireWorkerButton.onclick = () => {
                this.resourceController.addWorker();
                allWorkersParagraph.innerText = this.resourceController.workers.length;
            }
            hireWorkerButton.innerText = "Нанять рабочего";

            const dismissWorkerButton = document.createElement("button");
            dismissWorkerButton.onclick = () => {
                this.resourceController.removeWorker();
                allWorkersParagraph.innerText = this.resourceController.workers.length;
            }
            dismissWorkerButton.innerText = "Уволить рабочего";

            modalContent.append(paragraph);
            modalContent.append(allWorkersParagraph);
            modalContent.append(hireWorkerButton);
            modalContent.append(dismissWorkerButton);
        
            modal.style.visibility = "visible";
        }
        manageWorkerButton.innerText = "Управление рабочими";
        
        location_content.append(manageWorkerButton);
    }

    hide(){
        for (const action of this.actions) {
            action.stop();
        }
        const location_content = document.getElementById("location_content");
        location_content.innerHTML = "";
    }
}