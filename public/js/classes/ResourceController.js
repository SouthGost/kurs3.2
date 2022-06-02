import Resource from "./Resource.js";
import Worker from "./Worker.js";
import Money from "./Money.js";


export default class ResourceController {

    constructor(gltfLoader, htmlController) {
        this.htmlController = htmlController;
        this.money = new Money(15000);
        this.resources = [
            new Resource("Земля", "ground", "ground.glb", -20),
            new Resource("Обогащенная земля", "jewel_ground", "jewel_ground.glb", 50),
            new Resource("Гравий", "gravy", "gravy.glb", -10),
            new Resource("Обогащенный гравий", "jewel_gravy", "jewel_gravy.glb", 200),
        ];
        // this.choosedResourcesCountForSele = [];
        // for(let i = 0; i < this.resources.length; i++){
        //     this.choosedResourcesCountForSele[i] = 0;
        // } 
        this.levelsProbability = [
            [0.4, 0.2, 0.3, 0.1],
            [0.2, 0.1, 0.5, 0.2],
            [0, 0.05, 0.5, 0.45],
        ];
        this.workers = [
            new Worker(),
            new Worker(),
        ];
        this.workersParagraph = document.createElement("p");
        this.updateWorkersParagraph();
        for (let i = 0; i < this.resources.length; i++) {
            gltfLoader.load(`/models/mine/block/${this.resources[i].url}`, (gltf) => {
                this.resources[i].scene = gltf.scene;
            });
        }
    }

    addWorker(worker) {
        this.workers.push(worker);
        this.updateWorkersParagraph();
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
        this.updateWorkersParagraph();
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

    updateWorkersParagraph(){
        this.workersParagraph.innerText = `${this.workers.length} (${this.getFreeWorkersCount()})`;
    }

    getRandomResource(level) {
        let randomNumber = Math.random();
        let i = 0;
        let summ = 0;
        while (randomNumber > summ + this.levelsProbability[level][i] && i < this.levelsProbability[level].length - 1) {
            summ += this.levelsProbability[level][i];
            i++;
        }
        return this.resources[i];
    }

    showSeleInfo() {
        const elements = [];
        const table = document.createElement("table");
        for (const resource of this.resources) {
            resource.setCountForSale(0);

            const tr = document.createElement("tr");

            const tdCountForSale = document.createElement("td");
            tdCountForSale.append(resource.countForSaleParagraph);
            // resourceLine.className = "resource_sale"

            const nameResource = document.createElement("p");
            nameResource.innerText = resource.name;
            const tdNameResource = document.createElement("td");
            tdNameResource.append(nameResource);

            const addSaleResourceButton = document.createElement("button");
            addSaleResourceButton.onclick = () => {
                try {
                    resource.setCountForSale(resource.countForSale + 1);
                } catch (error) {
                    this.htmlController.notifyMessage(error.message);
                }
            }
            addSaleResourceButton.innerText = "+";
            const tdAddSaleResourceButton = document.createElement("td");
            tdAddSaleResourceButton.append(addSaleResourceButton);

            const removeSaleResourceButton = document.createElement("button");
            removeSaleResourceButton.onclick = () => {
                try {
                    resource.setCountForSale(resource.countForSale - 1);
                } catch (error) {
                    this.htmlController.notifyMessage(error.message);
                }
            }
            removeSaleResourceButton.innerText = "-";
            const tdRemoveSaleResourceButton = document.createElement("td");
            tdRemoveSaleResourceButton.append(removeSaleResourceButton);

            const tdProfit = document.createElement("td");
            tdProfit.append(resource.profitParagraph);

            tr.append(tdCountForSale);
            tr.append(tdNameResource);
            tr.append(tdAddSaleResourceButton);
            tr.append(tdRemoveSaleResourceButton);
            tr.append(tdProfit);
            table.append(tr);
        }
        const saleButton = document.createElement("button");
        saleButton.innerText = "Продать ресурсы";
        saleButton.onclick = () => {
            try {
                for (const resource of this.resources) {
                    resource.removeCount(resource.countForSale);
                    this.addMoney(resource.cost * resource.countForSale);
                    resource.setCountForSale(0);
                }
            } catch (error) {
                this.htmlController.notifyMessage(error.message);
            }
        }
        elements.push(table);
        elements.push(saleButton);

        return elements;
    }


}