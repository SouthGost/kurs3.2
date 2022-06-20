import * as SkeletonUtils from '../../jsm/utils/SkeletonUtils.js';

export default class Resource{
    
    constructor(name, url, cost, levelsProbabilitys){
        this.name = name;
        this.url = url;
        this.cost = cost;
        this.levelsProbabilitys = levelsProbabilitys;
        this.count = 0;
        this.countForSale = 0;
        
        this.countParagraph = document.createElement("p");
        this.countParagraph.innerText = this.count;

        this.profitParagraph = document.createElement("p");
        
        this.countForSaleInput = document.createElement("INPUT");
        this.countForSaleInput.setAttribute("type", "number");
        this.countForSaleInput.value = 0;
        this.countForSaleInput.onchange = (event) => {
            if(event.target.valueAsNumber > this.count){
                this.countForSaleInput.value = this.count;
                this.countForSale = this.count;
            } else if(event.target.valueAsNumber < 0){
                this.countForSaleInput.value = 0;
                this.countForSale = 0;
            } else {
                this.countForSale = event.target.valueAsNumber;
            }
            this.refreshProfitParagraph();
        }
        
        this.refreshProfitParagraph();
    }

    refreshProfitParagraph(){
        this.profitParagraph.innerText = this.countForSaleInput.value * this.cost;
    }

    clearCountForSale(){
        this.countForSale = 0;
        this.countForSaleInput.value = 0;
        this.refreshProfitParagraph();
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

    getProbability(level){
        return this.levelsProbabilitys[level];
    }

    getObject3D(){
        const object3D = SkeletonUtils.clone(this.scene);
        return object3D;
    }
    
}