import Improve from "./Improve.js";
import resourceArray from "./ResourceArray.js";

export default class ResourceImprove {

    constructor(resourceController, htmlController) {
        this.resourceController = resourceController;
        this.htmlController = htmlController;
        this.queue = [];
        this.permissibleImproves = [
            new Improve(this, resourceArray[3], resourceArray[4], 10000),
            new Improve(this, resourceArray[5], resourceArray[6], 8000),
            new Improve(this, resourceArray[8], resourceArray[9], 10000),
            new Improve(this, resourceArray[10], resourceArray[11], 15000),
            new Improve(this, resourceArray[13], resourceArray[14], 20000),
            new Improve(this, resourceArray[15], resourceArray[16], 40000),

        ];
        this.canImproveNow = 3;

        this.queueDiv = document.createElement("div");

        const upDiv = document.createElement("div");
        const downDiv = document.createElement("div");
        upDiv.className = "queue_row";
        downDiv.className = "queue_row";

        const queueParagraph = document.createElement("p");
        queueParagraph.innerText = "Очередь на обработку";

        const improvingNowParagraph = document.createElement("p");
        improvingNowParagraph.innerText = "Обрабатываются сейчас";

        this.queueContainer = document.createElement("div");
        this.improvingNowContainer = document.createElement("div");
        this.queueContainer.className = "queue_container";
        this.improvingNowContainer.className = "queue_container";


        upDiv.append(queueParagraph);
        upDiv.append(this.queueContainer);
        downDiv.append(improvingNowParagraph);
        downDiv.append(this.improvingNowContainer);
        this.queueDiv.append(upDiv);
        this.queueDiv.append(downDiv);
        
    }

    add(improve) {
        if (this.canImproveNow > 0) {
            this.canImproveNow--;
            const nowDiv = improve.do();
            this.improvingNowContainer.append(nowDiv);
        } else {
            const div = document.createElement("div");
            const queueElem = { improve, div };
            this.queue.push(queueElem);
            const cancelFunc = () => {
                try {
                    const canselElemIndex = this.queue.findIndex(elem => elem === queueElem);
                    if (canselElemIndex != undefined) {
                        const canselElem = this.queue[canselElemIndex];
                        this.resourceController.addResource(canselElem.improve.fromResource, 1)
                        this.queue.splice(canselElemIndex, 1)[0];
                        canselElem.div.remove();
                    }
                }catch(error){
                    this.htmlController.notifyMessage(`Нельзя отменить:\n${error.message}`);
                }
            }
            div.append(improve.createQueueDiv(cancelFunc));
            this.queueContainer.append(div);
        }
    }

    next(removedDiv) {
        removedDiv.remove();
        if (this.queue.length == 0) {
            this.canImproveNow++;
        } else {
            const nextImprove = this.queue.shift();
            nextImprove.div.remove();
            const nowDiv = nextImprove.improve.do();
            this.improvingNowContainer.append(nowDiv);
        }
    }

    showImproveInfo() {

        const improveTable = document.createElement("table");
        const hederTr = document.createElement("tr");
        const hederFromCount = document.createElement("td");
        const hederFromParagraphTD = document.createElement("td");
        const hederFromParagraph = document.createElement('p');

        hederFromParagraph.innerText = "Из";
        hederFromParagraphTD.append(hederFromParagraph);

        const hederToParagraphTD = document.createElement("td");
        const hederToParagraph = document.createElement('p');

        hederToParagraph.innerText = "В";
        hederToParagraphTD.append(hederToParagraph);
        hederTr.append(hederFromCount);
        hederTr.append(hederFromParagraphTD);
        hederTr.append(hederToParagraphTD);
        improveTable.append(hederTr);

        for (const permissibleImprove of this.permissibleImproves) {
            const tr = document.createElement("tr");
            const improveFromCountTD = document.createElement("td");
            improveFromCountTD.append(permissibleImprove.fromResource.countParagraph);

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
                    this.resourceController.removeResource(permissibleImprove.fromResource, 1);
                    this.add(permissibleImprove);
                } catch (error) {
                    this.htmlController.notifyMessage(error.message);
                }
            };
            improveButtonTD.append(improveButton);
            tr.append(improveFromCountTD);
            tr.append(improveFromParagraphTD);
            tr.append(improveToParagraphTD);
            tr.append(improveButtonTD);
            improveTable.append(tr);
        }

        return [
            this.queueDiv,
            improveTable
        ];
    }
}