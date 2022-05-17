import Resource from "./Resource.js";
import Worker from "./Worker.js";

// function random(a, b) {
//     if (a > b) {
//         throw new Error('a > b');
//     }
//     if (a == b) {
//         return a;
//     }
//     return Math.round(Math.random() * (b - a) + a);
// }

export default class ResourceController {

    constructor(gltfLoader) {
        this.resources = [
            new Resource("Земля", "ground", "ground.glb"),
            new Resource("Обогащенная земля", "jewel_ground", "jewel_ground.glb"),
            new Resource("Гравий", "gravy", "gravy.glb"),
            new Resource("Обогащенный гравий", "jewel_gravy", "jewel_gravy.glb"),
        ];
        this.levelsProbability = [0.4, 0.2, 0.3, 0.1];
        this.workers = [];
        for (let i = 0; i < this.resources.length; i++) {
            gltfLoader.load(`/models/block/${this.resources[i].url}`, (gltf) => {
                this.resources[i].scene = gltf.scene;
            });
        }
    }

    addWorker() {
        this.workers.push(new Worker());
    }

    //setWorkersCount(count){
    removeWorker() {
        let removedWorkerId = -1;
        for(let i = 0; i < this.workers.length; i++){
            if(this.workers[i].isFree){
                removedWorkerId = i;
                break;
            }
        }
        if(removedWorkerId == -1){
            throw new Error("Нет свободных рабочих, которых можно уволить");
        } 
        this.workers.splice(removedWorkerId,1);
    }

    getFreeWorker(){
        let freeWorker = undefined;
        for (const worker_  of this.workers) {
            if(worker_.isFree){
                freeWorker = worker_;
                break;
            }
        }
        if(freeWorker === undefined){
            throw new Error("Нет сободных рабочих");
        }
        return freeWorker;
    }

    // changeResourceCount(name, number){
    //     let changedResource;
    //     for (const resource_ of this.resources) {
    //         if(resource_.name2 === name) {
    //             changedResource = resource_;
    //             break;
    //         }
    //     }
    //     if(changedResource == undefined){
    //         throw new Error("Указан не верный ресурс");
    //     }
    //     changedResource.changeCount(number);
    // }

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