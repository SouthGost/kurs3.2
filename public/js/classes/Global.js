import * as THREE from 'three';

export default class Global {

    constructor(gltfLoader) {
        this.name = "База";
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
        camera.position.set(0, 0, 100);
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
        // this.work();
    }

    hide(){
        for (const action of this.actions) {
            action.stop();
        }
    }
}