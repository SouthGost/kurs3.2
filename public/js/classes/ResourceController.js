import Resource from "./Resource.js";
import Worker from "./Worker.js";
import Money from "./Money.js";


export default class ResourceController {

    constructor(gltfLoader) {
        this.money = new Money(400);
        this.resources = [
            new Resource("Земля", "ground", "ground.glb", -20),
            new Resource("Обогащенная земля", "jewel_ground", "jewel_ground.glb", 50),
            new Resource("Гравий", "gravy", "gravy.glb", -10),
            new Resource("Обогащенный гравий", "jewel_gravy", "jewel_gravy.glb", 200),
        ];
        this.levelsProbability = [0.4, 0.2, 0.3, 0.1];
        this.workers = [];
        for (let i = 0; i < this.resources.length; i++) {
            gltfLoader.load(`/models/block/${this.resources[i].url}`, (gltf) => {
                this.resources[i].scene = gltf.scene;
            });
        }
    }

    addWorker(worker) {
        this.workers.push(worker);
    }

    removeWorker() {
        let removedWorkerId = -1;
        for (let i = 0; i < this.workers.length; i++) {
            if (this.workers[i].isFree) {
                removedWorkerId = i;
                break;
            }
        }
        if (removedWorkerId == -1) {
            throw new Error("Нет свободных рабочих, которых можно уволить");
        }
        this.workers.splice(removedWorkerId, 1);
    }

    addMoney(value) {
        this.money.add(value);
    }

    removeMoney(value) {
        this.money.remove(value);
    }

    getFreeWorker() {
        let freeWorker = undefined;
        for (const worker_ of this.workers) {
            if (worker_.isFree) {
                freeWorker = worker_;
                break;
            }
        }
        if (freeWorker === undefined) {
            throw new Error("Нет сободных рабочих");
        }
        return freeWorker;
    }

    getFreeWorkersCount() {
        let count = 0;
        for (const worker_ of this.workers) {
            if (worker_.isFree) {
                count++;
            }
        }
        return count;
    }

    getWorkersInfo(){
        return `${this.workers.length} (${this.getFreeWorkersCount()})`;
    }

    getRandomResource() {
        let randomNumber = Math.random();
        let i = 0;
        let summ = 0;
        while (randomNumber > summ + this.levelsProbability[i] && i < this.levelsProbability.length - 1) {
            summ += this.levelsProbability[i];
            i++;
        }
        return this.resources[i];
    }


}