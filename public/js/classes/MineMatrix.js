import * as SkeletonUtils from '../../jsm/utils/SkeletonUtils.js';



export default class MineMatrix {

    work = () => {
        this.removeFromScene(0, this.matrix[0].length - 1);
    }

    ceateLevelOfBlocks = (k) => {
        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix[i].length; j++) {
                const root = this.resourceController.getRandomObject3D();
                root.position.set(i * 2, j * 2, k * 2);
                this.matrix[i][j][k] = root;
                this.scene.add(root);
            }
        }
    }

    moveBlocksForvard = () => {
        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix[i].length; j++) {
                this.matrix[i][j][1] = this.matrix[i][j][0];
                this.matrix[i][j][1].position.z+=2;
            }
        }
        this.ceateLevelOfBlocks(0);
    }

    removeFromScene = (i, j) => {
        setTimeout(() => {
            const resource = this.matrix[i][j][1];
            this.scene.remove(this.matrix[i][j][1]);
            this.resourceController.changeResourceCount(resource.name, 1);
            this.matrix[i][j][1] = undefined;
            // console.log(`удалил ${i}${j}`)
            if (i < this.matrix.length - 1) {
                i++;
                this.removeFromScene(i, j)
            } else if (i == this.matrix.length - 1 && j > 0) {
                i = 0;
                j--;
                this.removeFromScene(i, j)
            } else{
                setTimeout(() => {
                    this.moveBlocksForvard();
                    this.work();
                },500)
            }
        }, 1000)
    }

    constructor(scene, resourceController) {
        this.resourceController = resourceController;
        this.scene = scene;
        this.matrix = new Array(4);
        for (let i = 0; i < this.matrix.length; i++) {
            this.matrix[i] = new Array(4);
            for (let j = 0; j < this.matrix[i].length; j++) {
                this.matrix[i][j] = new Array(2);
            }

        }
        for (let k = 0; k < this.matrix[0][0].length; k++) {
            this.ceateLevelOfBlocks(k);
        }
    }
}