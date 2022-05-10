import Resource from "./Resource.js";

function random(a, b) {
    if (a > b) {
        throw new Error('a > b');
    }
    if (a == b) {
        return a;
    }
    return Math.round(Math.random() * (b - a) + a);
}

export default class ResourceController{

    constructor(gltfLoader){
        this.resources = [
            new Resource("Земля","ground","ground.glb"),
            new Resource("Обагащенная земля","jewel_ground","jewel_ground.glb"),
            new Resource("Гравий","gravy","gravy.glb"),
            new Resource("Обагащенный гравий","jewel_gravy","jewel_gravy.glb"),
        ];
        this.levelsProbability = [0.4, 0.2, 0.3, 0.1];
        for (let i = 0; i < this.resources.length; i++) {
            gltfLoader.load(`/models/block/${this.resources[i].url}`, (gltf) => {
                this.resources[i].scene = gltf.scene;
            });
        }
    }

    changeResourceCount(name, number){
        let changedResource;
        for (const resource_ of this.resources) {
            if(resource_.name2 === name) {
                changedResource = resource_;
                break;
            }
        }
        if(changedResource == undefined){
            throw new Error("Указан не верный ресурс");
        }
        changedResource.changeCount(number);
    }

    getRandomObject3D(){
        let randomNumber = Math.random();
        let i = 0;
        let summ = 0;
        while(randomNumber > summ + this.levelsProbability[i] && i < this.levelsProbability.length-1){
            summ += this.levelsProbability[i];
            i++;
        }
        return this.resources[i].getObject3D();
    }


}