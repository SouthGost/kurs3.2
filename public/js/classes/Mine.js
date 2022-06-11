import Space from "./Space.js";
import MineMatrix from "./MineMatrix.js";
import ResourceController from "./ResourceController.js";
import * as THREE from 'three';
import Worker from './Worker.js';


export default class Mine {

    constructor(gltfLoader, resourceController, htmlController) {
        this.name = "Шахта";
        this.resourceController = resourceController;
        this.htmlController = htmlController;
        this.heaps = [];
        this.minecart = undefined;
        this.minecartAction = undefined;
        this.miner = new THREE.Object3D();
        this.miner.name = "miner";
        this.handAction = undefined;
        this.scene = undefined;
        this.currentMineShowId = 0;
        this.mineMatrixs = [
            new MineMatrix(this.resourceController, this.htmlController, 0, 100, true),
            new MineMatrix(this.resourceController, this.htmlController, 1, 500, false, 10000),
            new MineMatrix(this.resourceController, this.htmlController, 2, 1000, false, 100000),
        ];
        for (const mineMatrix of this.mineMatrixs) {
            mineMatrix.setHeaps(this.heaps);
            mineMatrix.setMiner(this.miner);
        }
        this.objects3d = [
            new THREE.HemisphereLight(0xFFE4B5, 0x000000, 1),
        ];
        this.mixers = [];
        gltfLoader.load(`/models/location/Mine.glb`, (gltf) => {
            const root = gltf.scene;
            root.position.set(6, -2, 26);
            this.objects3d.push(root);
        });
        gltfLoader.load(`/models/mine/miners_body.glb`, (gltf) => {
            const root = gltf.scene;
            root.position.set(2, 0, 6);
            this.miner.add(root);
            // this.objects3d.push(root);
        });
        gltfLoader.load(`/models/mine/miners_hand.glb`, (gltf) => {
            const root = gltf.scene;
            root.name = "hand"
            root.position.set(2, 3, 4.75);

            const times = [0, 1];
            const values = [
                0.1, 0, 0, 0,             //0
                0.1, 0, 0, 1 * Math.PI/2, //1
            ];
            const handRotationKF = new THREE.QuaternionKeyframeTrack('hand.quaternion', times, values);
            const handRotationAnimation = new THREE.AnimationClip('handm.rotation_animation', -1, [handRotationKF]);
            const mixer = new THREE.AnimationMixer(root);
            this.mixers.push(mixer);
            this.handAction = mixer.clipAction(handRotationAnimation);

            // this.objects3d.push(root);
            this.miner.add(root);
            for (const mineMatrix of this.mineMatrixs) {
                mineMatrix.setHandAction(this.handAction);
            }
        });
        gltfLoader.load(`/models/mine/minecart.glb`, (gltf) => {
            this.minecart = gltf.scene;
            this.minecart.name = 'minecart';

            const times = [0, 4];
            const values = [
                5, 0, 10,
                5, 0, 50
            ];
            const minecartMove_KF = new THREE.VectorKeyframeTrack('minecart.position', times, values);
            const minecartMove_animation = new THREE.AnimationClip('minecart.position_animation', -1, [minecartMove_KF]);
            const mixer = new THREE.AnimationMixer(this.minecart);
            this.mixers.push(mixer);
            this.minecartAction = mixer.clipAction(minecartMove_animation);

            this.minecartAction.setLoop(THREE.LoopOnce);
            this.minecartAction.clampWhenFinished = false;

            mixer.addEventListener('finished', function (e) {
                const heap = gltf.scene.getObjectByName("heap");
                if (heap != undefined) {
                    gltf.scene.remove(heap);
                }
            });

            this.minecart.position.set(5, 0, 10);
            this.objects3d.push(this.minecart);
            for (const mineMatrix of this.mineMatrixs) {
                mineMatrix.setMinecart(this.minecart);
                mineMatrix.setMinecartAction(this.minecartAction);
            }
        });
        gltfLoader.load(`/models/mine/heap1.glb`, (gltf) => {
            const root = gltf.scene;
            root.name = 'heap'
            this.heaps[0] = root;
        });
        gltfLoader.load(`/models/mine/heap2.glb`, (gltf) => {
            const root = gltf.scene;
            root.name = 'heap'
            this.heaps[1] = root;
        });
    }


    visible(renderer, scene, camera, mixers) {
        this.htmlController.setBackgroundColor("rgba(255, 255, 255, 0.37)");
        const header = document.getElementById("header");
        // header.style.color = "white";

        this.scene = scene;
        renderer.setClearColor(0x000000);
        camera.position.set(10, 10, 10);
        camera.lookAt(0, 0, 0);
        for (const object_ of this.objects3d) {
            scene.add(object_);
        }
        for (const mixer of this.mixers) {
            mixers.push(mixer);
        }
        this.mineMatrixs[this.currentMineShowId].show(scene);
        if (this.mineMatrixs[this.currentMineShowId].workers.length > 0) {
            this.scene.add(this.miner);
            this.handAction.play();
        }
        this.showInfo();
    }

    showMine(index) {
        try {
            if (index != this.currentMineShowId) {
                this.mineMatrixs[this.currentMineShowId].stopShow();
                this.minecartAction.stop();
                if(this.scene.getObjectByName("miner") != undefined){
                    this.scene.remove(this.miner);
                }
                this.handAction.stop();
                const heap = this.minecart.getObjectByName("heap");
                this.minecart.remove(heap);
                this.mineMatrixs[index].show(this.scene);
                if (this.mineMatrixs[index].workers.length > 0) {
                    this.scene.add(this.miner);
                    this.handAction.play();
                }
                this.currentMineShowId = index;
            }
        } catch (error) {
            this.mineMatrixs[this.currentMineShowId].show(this.scene);
            this.htmlController.notifyMessage(error.message);
        }
    }

    showModal() {
        const elements = [];

        const paragraph = document.createElement("p");
        paragraph.innerText = "Рабочих всего";
        elements.push(paragraph);

        elements.push(this.resourceController.workersParagraph);

        const hireWorkerButton = document.createElement("button");
        hireWorkerButton.innerText = "Нанять рабочего 200 ₽ в месяц";
        hireWorkerButton.onclick = () => {
            try {
                const worker = new Worker();
                // this.resourceController.removeMoney(worker.cost);
                this.resourceController.addWorker(worker);
            } catch (error) {
                this.htmlController.notifyMessage(error.message);
            }
        }
        elements.push(hireWorkerButton);

        const dismissWorkerButton = document.createElement("button");
        dismissWorkerButton.innerText = "Уволить рабочего 3 месячных зарплаты";
        dismissWorkerButton.onclick = () => {
            try {
                const worker = this.resourceController.removeWorker();
                this.resourceController.removeMoney(worker.salary * 3);
            } catch (error) {
                this.htmlController.notifyMessage(error.message);
            }
        }
        elements.push(dismissWorkerButton);

        const table = document.createElement('table');

        const tableHederTr = document.createElement("tr");

        const nameTd = document.createElement("td");
        const nameParagraph = document.createElement("p");
        nameParagraph.innerText = "Шахта";
        nameTd.append(nameParagraph);

        const workersCountTd = document.createElement("td");
        const workersCountParagraph = document.createElement("p");
        workersCountParagraph.innerText = "Рабочих в ней";
        workersCountTd.append(workersCountParagraph);

        tableHederTr.append(nameTd);
        tableHederTr.append(workersCountTd);
        table.append(tableHederTr);

        for (let i = 0; i < this.mineMatrixs.length; i++) {
            //table.append(mineMatrix.showMineInfo());

            const tr = document.createElement("tr");

            if (this.mineMatrixs[i].isOpen) {
                const chuseMineTd = document.createElement("td");
                const chuseMineButton = document.createElement("button");
                chuseMineButton.innerText = `Показать шахту на глубине ${this.mineMatrixs[i].depth}`;
                chuseMineButton.onclick = () => {
                    this.showMine(i);
                    this.htmlController.closeModal();
                }
                chuseMineTd.append(chuseMineButton);

                const workersCountTd = document.createElement("td");
                workersCountTd.append(this.mineMatrixs[i].workersCountParagraph);

                const addWorkerTd = document.createElement("td");
                const addWorkerButton = document.createElement("button");
                addWorkerButton.innerText = "+";
                addWorkerButton.onclick = () => {
                    try {
                        this.mineMatrixs[i].addWorker(this.resourceController.getFreeWorker());
                    } catch (error) {
                        this.htmlController.notifyMessage(error.message);
                    }
                };
                addWorkerTd.append(addWorkerButton);

                const removeWorkerTd = document.createElement("td");
                const removeWorkerButton = document.createElement("button");
                removeWorkerButton.innerText = "-";
                removeWorkerButton.onclick = () => {
                    try {
                        this.mineMatrixs[i].removeWorker();
                    } catch (error) {
                        this.htmlController.notifyMessage(error.message);
                    }
                };
                removeWorkerTd.append(removeWorkerButton);

                tr.append(chuseMineTd);
                tr.append(workersCountTd);
                tr.append(addWorkerTd);
                tr.append(removeWorkerTd);
            } else {
                const openMineTd = document.createElement("td");
                const openMineButton = document.createElement("button");
                openMineButton.innerText = `Открыть шахту на глубине ${this.mineMatrixs[i].depth} за ${this.mineMatrixs[i].cost}`;
                openMineButton.onclick = () => {
                    try {
                        this.mineMatrixs[i].openMine();
                        this.showModal();
                    } catch (error) {
                        this.htmlController.notifyMessage(error.message);
                    }
                }
                openMineTd.append(openMineButton);

                tr.append(openMineTd);
            }
            table.append(tr);
        }
        elements.push(table);

        this.htmlController.openModal("Управление шахтами", elements);
    }

    showInfo() {

        const manageMineButton = document.createElement("button");
        manageMineButton.innerText = "Управление шахтами";
        manageMineButton.onclick = () => {
            this.showModal();
        }

        this.htmlController.showLocationContent([manageMineButton]);
    }

    hide() {
        this.scene = undefined;
        this.handAction.stop();
        this.mineMatrixs[this.currentMineShowId].stopShow();
    }

}