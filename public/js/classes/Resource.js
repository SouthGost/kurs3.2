import * as SkeletonUtils from '../../jsm/utils/SkeletonUtils.js';

export default class Resource{
    
    constructor(name, name2, url, cost, levelsProbabilitys){
        this.name = name;
        this.name2 = name2;
        this.url = url;
        this.cost = cost;
        this.levelsProbabilitys = levelsProbabilitys;
        this.count = 0;
        this.countForSale = 0;
        
        const infoContent = document.getElementById("info_content");

        const rowDiv = document.createElement("div");
        rowDiv.className = "row";

        this.countParagraph = document.createElement("p");
        this.countParagraph.innerText = this.count;

        const nameParagraph = document.createElement("p");
        nameParagraph.innerText = name;

        rowDiv.append(this.countParagraph);
        rowDiv.append(nameParagraph);

        infoContent.append(rowDiv);

        this.countForSaleParagraph = document.createElement("p");
        this.countForSaleParagraph.innerText = this.countForSale;

        this.profitParagraph = document.createElement("p");
        this.profitParagraph.innerText = this.countForSale * this.cost;
    }

    addCount(number){
        if(this.count + number < 0){
            throw new Error("Недостаточно ресурсов");
        }
        this.count += number;
        this.countParagraph.innerText = this.count;
    }

    removeCount(number){
        if(this.count - number < 0){
            throw new Error("Недостаточно ресурсов");
        }
        this.count -= number;
        this.countParagraph.innerText = this.count;
    }

    setCountForSale(number){
        if(number < 0){
            throw new Error("Нельзя продавать отрицательное значение ресурсов")
        }
        if(number > this.count){
            throw new Error("Недостаточно ресурсов");
        }
        this.countForSale = number;
        this.countForSaleParagraph.innerText = this.countForSale;
        this.profitParagraph.innerText = this.countForSale * this.cost;
    }

    getProbability(level){
        return this.levelsProbabilitys[level];
    }

    getObject3D(){
        const object3D = SkeletonUtils.clone(this.scene);
        object3D.name = this.name2;
        return object3D;
    }
    
}