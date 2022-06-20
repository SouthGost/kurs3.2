import * as THREE from 'three';
import Worker from "./Worker.js";
import Money from "./Money.js";
import resourceArray from "./ResourceArray.js";
import Timer from "./Timer.js";

export default class ResourceController {

    constructor(gltfLoader, htmlController) {
        this.htmlController = htmlController;
        this.money = new Money(1000);
        this.month = 1;
        this.resources = resourceArray;
        this.resourcesCount = 0;
        this.maxResourcesCount = 500;
        this.isGame = true;
        this.workers = [
            new Worker(),
            new Worker(),
        ];
        this.workersParagraph = document.createElement("p");
        this.refreshWorkersParagraph();
        for (let i = 0; i < this.resources.length; i++) {
            if (this.resources[i].url != null) {
                gltfLoader.load(`/models/mine/block/${this.resources[i].url}`, (gltf) => {
                    this.resources[i].scene = gltf.scene;
                });
            } else {
                this.resources[i].scene = new THREE.Object3D();;
            }
        }
    }

    startNewMonth() {
        const timeLeftParagraph = document.getElementById("time_left");
        const timer = new Timer(() => {
            try {
                let monthExpenses = 0;
                for (const worker of this.workers) {
                    this.money.remove(worker.salary)
                    monthExpenses += worker.salary;
                }
                this.htmlController.notifyMessage(`На зарплаты потраченно ${monthExpenses}`);
                this.month++;
                const monthParagraph = document.getElementById("month");
                monthParagraph.innerText = this.month;
                this.startNewMonth()
            } catch (error) {
                console.log(error);
                this.lose();
            }
        }, 150_000);

        timeLeftParagraph.innerHTML = "";
        timeLeftParagraph.append(timer.paragraph);
        timer.start();
    }

    lose() {
        this.isGame = false;
        this.money.remove(this.money.value);
        const loseParagraph = document.createElement("p");
        loseParagraph.innerText = `Ваш результат ${this.month} месяц(ев).`
        this.htmlController.openModal("Игра закончена", [loseParagraph], false);
    }

    isMaxResources() {
        if (this.maxResourcesCount <= this.resourcesCount) {
            return true;
        } else {
            return false;
        }
    }

    addResource(resource, count) {
        if (this.maxResourcesCount > this.resourcesCount) {
            resource.addCount(count);
            this.resourcesCount += count;
        } else {
            throw new Error("Склад переполнен");
        }

    }

    removeResource(resource, count) {
        if (count > 0) {
            resource.removeCount(count);
            this.resourcesCount -= count;
        }
    }

    addWorker(worker) {
        this.workers.push(worker);
        this.refreshWorkersParagraph();
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
        this.removeMoney(this.workers[removedWorkerId].salary * 3);
        const worker = this.workers.splice(removedWorkerId, 1)[0];
        this.refreshWorkersParagraph();
        return worker;
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

    refreshWorkersParagraph() {
        this.workersParagraph.innerText = `${this.workers.length} (${this.getFreeWorkersCount()})`;
    }

    getRandomResource(level) {
        let randomNumber = Math.random();
        let i = 0;
        let summ = 0;
        while (randomNumber > summ + this.resources[i].getProbability(level) && i < this.resources.length - 1) {
            summ += this.resources[i].getProbability(level);
            i++;
        }
        return this.resources[i];
    }

    seleTable() {
        const elements = [];
        const table = document.createElement("table");
        const headerTr = document.createElement("tr");

        const tdCountHeader = document.createElement("td");
        const paragraphCountHeader = document.createElement("p");
        paragraphCountHeader.innerText = "Добыто";
        tdCountHeader.append(paragraphCountHeader);

        const tdNameResourceHeader = document.createElement("td");
        const paragraphNameResourceHeader = document.createElement("p");
        paragraphNameResourceHeader.innerText = "Название";
        tdNameResourceHeader.append(paragraphNameResourceHeader);

        const tdCostHeader = document.createElement("td");
        const paragraphCostHeader = document.createElement("p");
        paragraphCostHeader.innerText = "Цена";
        tdCostHeader.append(paragraphCostHeader);

        const tdCountForSaleHeader = document.createElement("td");
        const paragraphCountForSaleHeader = document.createElement("p");
        paragraphCountForSaleHeader.innerText = "На продажу";
        tdCountForSaleHeader.append(paragraphCountForSaleHeader);

        const tdProfitHeader = document.createElement("td");
        const paragraphProfitHeader = document.createElement("p");
        paragraphProfitHeader.innerText = "В сумме";
        tdProfitHeader.append(paragraphProfitHeader);

        headerTr.append(tdCountHeader);
        headerTr.append(tdNameResourceHeader);
        headerTr.append(tdCostHeader);
        headerTr.append(tdCountForSaleHeader);
        headerTr.append(tdProfitHeader);

        table.append(headerTr);

        for (const resource of this.resources) {
            resource.clearCountForSale();

            const tr = document.createElement("tr");

            const tdCount = document.createElement("td");
            tdCount.append(resource.countParagraph);


            const tdNameResource = document.createElement("td");
            const nameResource = document.createElement("p");
            nameResource.innerText = resource.name;
            tdNameResource.append(nameResource);

            const tdCost = document.createElement("td");
            const costParagraph = document.createElement("p");
            costParagraph.innerText = resource.cost;
            tdCost.append(costParagraph);

            const tdCountForSale = document.createElement("td");
            tdCountForSale.append(resource.countForSaleInput);

            const tdProfit = document.createElement("td");
            tdProfit.append(resource.profitParagraph);

            tr.append(tdCount)
            tr.append(tdNameResource);
            tr.append(tdCost);

            tr.append(tdCountForSale);
            tr.append(tdProfit);
            table.append(tr);
        }
        elements.push(table);

        return table;
    }


}