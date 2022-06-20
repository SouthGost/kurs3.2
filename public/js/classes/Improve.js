import Timer from "./Timer.js";

export default class Improve {

    constructor(resourceImprove, fromResource, toResource, time) {
        this.resourceImprove = resourceImprove;
        this.fromResource = fromResource;
        this.toResource = toResource;
        this.time = time;
    }

    do() {
        const div = document.createElement("div");
        div.className = "queue_elem";
        const nameParagraph = document.createElement("p");
        const onFinish = () => {
            try {
                this.resourceImprove.resourceController.addResource(this.toResource, 1);
                this.resourceImprove.htmlController.notifyMessage(`Обработано ${this.toResource.name}`);
                this.resourceImprove.next(div);
            } catch (error) {
                this.resourceImprove.htmlController.notifyMessage(`Не получается завершить обработку:\n${error.message}`);
                setTimeout(onFinish, 5000);
            }
        }
        const timer = new Timer(onFinish, this.time);

        nameParagraph.innerText = this.toResource.name;
        div.append(nameParagraph);
        div.append(timer.paragraph);
        timer.start();

        return div;
    }

    createQueueDiv(cancelFunc) {
        const div = document.createElement("div");
        div.className = "queue_elem";
        const paragraph = document.createElement("p");
        const button = document.createElement("button");

        paragraph.innerText = this.toResource.name;
        button.innerText = "Отмена";
        button.onclick = cancelFunc;
        div.append(paragraph);
        div.append(button);
        return div;
    }
}