import * as SkeletonUtils from '../../jsm/utils/SkeletonUtils.js';

export default class MinematrixResources {

    constructor(resourceController) {
        this.resourceController = resourceController;
        this.scene = undefined;
        this.matrixResources = new Array(4);
        this.matrixObjects3D = new Array(4);
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
    }

    work() {
        this.getResource(0, this.matrixResources[0].length - 1);
    }

    ceateLevelOfResources(k) {
        for (let i = 0; i < this.matrixResources.length; i++) {
            for (let j = 0; j < this.matrixResources[i].length; j++) {
                const resource = this.resourceController.getRandomResource();
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
    }

    getResource(i, j) {
        setTimeout(() => {
            const resource = this.matrixResources[i][j][1];
            if (this.scene != undefined) {
                this.scene.remove(this.matrixObjects3D[i][j][1]);
                this.matrixObjects3D[i][j][1] = undefined;
            }
            resource.changeCount(1)
            // this.resourceController.changeResourceCount(resource.name, 1);
            this.matrixResources[i][j][1] = undefined;
            // console.log(`удалил ${i}${j}`)
            if (i < this.matrixResources.length - 1) {
                i++;
                this.getResource(i, j)
            } else if (i == this.matrixResources.length - 1 && j > 0) {
                i = 0;
                j--;
                this.getResource(i, j)
            } else {
                setTimeout(() => {
                    this.moveBlocksForvard();
                    this.work();
                }, 500)
            }
        }, 1000)
    }

    show(scene) {
        this.scene = scene;

        for (let i = 0; i < this.matrixResources.length; i++) {
            for (let j = 0; j < this.matrixResources[i].length; j++) {
                for (let k = 0; k < this.matrixResources[i][j].length; k++){
                    const resource = this.matrixResources[i][j][k];
                    if(resource != undefined){
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
        this.scene = undefined;
    }
}