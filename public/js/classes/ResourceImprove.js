import Improve from "./Improve.js";
import resourceArray from "./ResourceArray.js";

export default class ResourceImprove {

    constructor(htmlController) {
        this.htmlController = htmlController;
        this.queue = [];
        this.permissibleImproves = [
            new Improve(this, resourceArray[3], resourceArray[4], 10000)
        ];
        this.canImprovenow = 3;

        //таблица очереди
        this.queueTable = document.createElement("table");

        this.queueContainer = document.createElement("tr");
        this.improvingNowContainer = document.createElement("tr");

        const queueTd = document.createElement("td");
        const queueParagraph = document.createElement("p");

        queueParagraph.innerText = "Очередь на обработку";
        queueTd.append(queueParagraph);
        this.queueContainer.append(queueTd);

        const improvingNowTd = document.createElement("td");
        const improvingNowParagraph = document.createElement("p");

        improvingNowParagraph.innerText = "Обрабатываются сейчас";
        improvingNowTd.append(improvingNowParagraph);
        this.improvingNowContainer.append(improvingNowTd);
        this.queueTable.append(this.queueContainer);
        this.queueTable.append(this.improvingNowContainer);

        //таблица возможных улучшений
        this.improveTable = document.createElement("table");
        const hederTr = document.createElement("tr");
        const hederFromParagraphTD = document.createElement("td");
        const hederFromParagraph = document.createElement('p');

        hederFromParagraph.innerText = "Из";
        hederFromParagraphTD.append(hederFromParagraph);

        const hederToParagraphTD = document.createElement("td");
        const hederToParagraph = document.createElement('p');

        hederToParagraph.innerText = "В";
        hederToParagraphTD.append(hederToParagraph);
        hederTr.append(hederFromParagraphTD);
        hederTr.append(hederToParagraphTD);
        this.improveTable.append(hederTr);

        for (const permissibleImprove of this.permissibleImproves) {
            const tr = document.createElement("tr");
            const improveFromParagraphTD = document.createElement("td");
            const improveFromParagraph = document.createElement('p');
            
            improveFromParagraph.innerText = permissibleImprove.fromResource.name;
            improveFromParagraphTD.append(improveFromParagraph);

            const improveToParagraphTD = document.createElement("td");
            const improveToParagraph = document.createElement('p');
            
            improveToParagraph.innerText = permissibleImprove.toResource.name;
            improveToParagraphTD.append(improveToParagraph);

            const improveButtonTD = document.createElement("td");
            const improveButton = document.createElement("button");
            
            improveButton.innerText = "Добавить в очередь";
            improveButton.onclick = () => {
                try {
                    permissibleImprove.fromResource.removeCount(1);
                    this.add(permissibleImprove);
                } catch (error) {
                    this.htmlController.notifyMessage(error.message);
                }
            };
            improveButtonTD.append(improveButton);
            tr.append(improveFromParagraphTD);
            tr.append(improveToParagraphTD);
            tr.append(improveButtonTD);
            this.improveTable.append(tr);
        }
    }

    add(improve) {
        if (this.canImprovenow > 0) {
            this.canImprovenow--;
            const nowTd = improve.createNowTd();
            improve.do(nowTd);
            this.improvingNowContainer.append(nowTd);
        } else {
            const td = improve.createQueueTd();
            this.queue.push({improve, td});
            this.queueContainer.append(td);
        }
    }

    next(removedTd) {
        console.log("Улучшение next")
        removedTd.remove();
        if (this.queue.length == 0) {
            this.canImprovenow++;
        } else {
            const nextImprove = this.queue.shift();
            const nowTd = nextImprove.improve.createNowTd();
            nextImprove.td.remove();
            nextImprove.improve.do(nowTd);
            this.improvingNowContainer.append(nowTd);
        }
    }

    showImproveInfo() {
        

        // for(let i = 0; i < this.queue.length; i++) {
        //     // const nextImproveDiv = document.createElement("div");

        //     // nextImproveDiv.innerText = this.queue[i].toResource.name;
        //     // this.queueContainer.append(nextImproveDiv);
        //     this.createImproveInQueueDiv(this.queue[i]);
        // }

        return [
            this.queueTable,
            this.improveTable
        ];
    }
}