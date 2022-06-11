import * as SkeletonUtils from '../../jsm/utils/SkeletonUtils.js';
import Worker from "./Worker.js"

export default class MinematrixResources {


    constructor(resourceController, htmlController, level, depth, isOpen, cost = 0) {
        this.resourceController = resourceController;
        this.htmlController = htmlController;
        this.level = level;
        this.depth = depth;
        this.isOpen = isOpen;
        this.cost = cost;
        this.scene = undefined;
        this.minecart = undefined;
        this.minecartAction = undefined;
        this.miner = undefined;
        this.handAction = undefined;
        this.heaps = undefined;
        this.matrixResources = new Array(4);
        this.matrixObjects3D = new Array(4);
        this.workers = [];
        this.workersCountParagraph = document.createElement('p');
        this.workersCountParagraph.innerText = this.workers.length;
        for (let i = 0; i < this.matrixResources.length; i++) {
            this.matrixResources[i] = new Array(4);
            this.matrixObjects3D[i] = new Array(4);
            for (let j = 0; j < this.matrixResources[i].length; j++) {
                this.matrixResources[i][j] = new Array(2);
                this.matrixObjects3D[i][j] = new Array(2);
            }
        }
        for (let k = 0; k < this.matrixResources[0][0].length; k++) {
            this.ceateLevelOfResources(k);
        }
        this.minedResourceI = 0;
        this.minedResourceJ = this.matrixResources[0].length - 1;
        // if (isOpen) {
        //     this.work();
        // }
    }

    checkMine() {
        if (!this.isOpen) {
            throw new Error("Шахта неоткрыта");
        }
    }

    openMine() {
        if (this.isOpen) {
            throw new Error("Шахта уже открыта");
        }
        this.resourceController.removeMoney(this.cost)
        this.isOpen = true;
    }

    setMinecart(minecart) {
        this.minecart = minecart;
    }

    setMinecartAction(minecartAction) {
        this.minecartAction = minecartAction;
    }

    setMiner(miner){
        this.miner = miner;
    }

    setHandAction(handAction){
        this.handAction = handAction;
    }

    setHeaps(heaps) {
        this.heaps = heaps;
    }

    work() {
        this.checkMine();
        this.getNextResource();
    }

    ceateLevelOfResources(k) {
        for (let i = 0; i < this.matrixResources.length; i++) {
            for (let j = 0; j < this.matrixResources[i].length; j++) {
                const resource = this.resourceController.getRandomResource(this.level);
                this.matrixResources[i][j][k] = resource;

                if (this.scene != undefined) {
                    const object3D = resource.getObject3D();
                    this.matrixObjects3D[i][j][k] = object3D;
                    object3D.position.set(i * 2, j * 2, k * 2);
                    this.scene.add(object3D);
                }
            }
        }
    }

    moveBlocksForvard() {
        for (let i = 0; i < this.matrixResources.length; i++) {
            for (let j = 0; j < this.matrixResources[i].length; j++) {
                this.matrixResources[i][j][1] = this.matrixResources[i][j][0];
                if (this.scene != undefined) {
                    this.matrixObjects3D[i][j][1] = this.matrixObjects3D[i][j][0];
                    this.matrixObjects3D[i][j][1].position.z += 2;
                }
            }
        }
        this.ceateLevelOfResources(0);
        if (this.scene != undefined) {
            this.minecart.add(this.heaps[1]);
            this.minecartAction.stop();
            this.minecartAction.play();
        }

    }

    getNextResource() {
        if (!this.workers.length == 0 && this.resourceController.isLive) {
            setTimeout(() => {
                if (!this.workers.length == 0) {
                    try{//if(!this.resourceController.isMaxResources())
                        const resource = this.matrixResources[this.minedResourceI][this.minedResourceJ][1];
                        this.resourceController.addResource(resource, 1);
                        if (this.scene != undefined) {
                            this.scene.remove(this.matrixObjects3D[this.minedResourceI][this.minedResourceJ][1]);
                            this.matrixObjects3D[this.minedResourceI][this.minedResourceJ][1] = undefined;
                        }
                        // resource.addCount(1)
                        this.matrixResources[this.minedResourceI][this.minedResourceJ][1] = undefined;
                        // console.log(`удалил ${i}${j}`)
                        if (this.minedResourceI < this.matrixResources.length - 1) {
                            this.minedResourceI++;
                            this.getNextResource()
                        } else if (this.minedResourceI == this.matrixResources.length - 1 && this.minedResourceJ > 0) {
                            this.minedResourceI = 0;
                            this.minedResourceJ--;
                            this.getNextResource()
                        } else {
                            setTimeout(() => {
                                this.minedResourceI = 0;
                                this.minedResourceJ = this.matrixResources[0].length - 1;
                                this.moveBlocksForvard();
                                this.getNextResource();
                            }, 500 / this.workers.length)//
                        }
                    } catch(error) {

                        this.htmlController.notifyMessage(`Добыча ресурсов преостановлена:\n${error.message}`);
                        setTimeout(() => {
                            this.getNextResource()
                        }, 5000)
                    }
                }
            }, 1000 / this.workers.length)
        }
    }

    addWorker(worker) {
        this.checkMine();
        if (!worker.isFree) {
            throw new Error("Этот рабочий занят");
        }
        worker.isFree = false;
        this.workers.push(worker);
        if (this.workers.length == 1) {
            if(this.scene != undefined){
                this.scene.add(this.miner);
            }
            this.handAction.play();
            this.work();
        }
        this.workersCountParagraph.innerText = this.workers.length;
        this.resourceController.updateWorkersParagraph();
    }

    removeWorker() {
        this.checkMine();
        if (this.workers.length == 0) {
            throw new Error("В шахте нет рабочих");
        } else if(this.workers.length == 1) {
            if(this.scene != undefined){
                this.scene.remove(this.miner);
            }
            this.handAction.stop();
        }
        const worker = this.workers.splice(0, 1);
        worker[0].isFree = true;
        this.workersCountParagraph.innerText = this.workers.length;
        this.resourceController.updateWorkersParagraph();
    }

    show(scene) {
        this.checkMine();
        this.scene = scene;

        for (let i = 0; i < this.matrixResources.length; i++) {
            for (let j = 0; j < this.matrixResources[i].length; j++) {
                for (let k = 0; k < this.matrixResources[i][j].length; k++) {
                    const resource = this.matrixResources[i][j][k];
                    if (resource != undefined) {
                        const object3D = resource.getObject3D();
                        this.matrixObjects3D[i][j][k] = object3D;
                        object3D.position.set(i * 2, j * 2, k * 2);
                        this.scene.add(object3D);
                    }
                }
            }
        }
    }

    stopShow() {
        const scene = this.scene;
        this.scene = undefined;
        for (let i = 0; i < this.matrixObjects3D.length; i++) {
            for (let j = 0; j < this.matrixObjects3D[i].length; j++) {
                for (let k = 0; k < this.matrixObjects3D[i][j].length; k++) {
                    if (this.matrixObjects3D[i][j][k] != undefined) {
                        scene.remove(this.matrixObjects3D[i][j][k])
                    }
                }
            }
        }
    }

}