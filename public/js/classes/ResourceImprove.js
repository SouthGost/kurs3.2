import Improve from "./Improve.js";
import resourceArray from "./ResourceArray.js";

export default class ResourceImprove {

    constructor(resourceController, htmlController) {
        this.resourceController = resourceController;
        this.htmlController = htmlController;
        this.queue = [];
        this.permissibleImproves = [
            new Improve(this, resourceArray[3], resourceArray[4], 10000)
        ];
        this.canImprovenow = 3;

        //таблица очереди
        this.queueDiv = document.createElement("div");
        // this.queueDiv.className = "slider_table";

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

        //chernovik
        // for(let i = 0; i < 20; i++){
        //     this.queueContainer.append(this.permissibleImproves[0].createQueueDiv());
        // }
        // for(let i = 0; i < 29; i++){
        //     this.improvingNowContainer.append(this.permissibleImproves[0].createNowDiv());
        // }

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
                    this.resourceController.removeResource(permissibleImprove.fromResource, 1);
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
            this.canImprovenow++;
        } else {
            const nextImprove = this.queue.shift();
            nextImprove.div.remove();
            const nowDiv = nextImprove.improve.do();
            this.improvingNowContainer.append(nowDiv);
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
            this.queueDiv,
            this.improveTable
        ];
    }
}