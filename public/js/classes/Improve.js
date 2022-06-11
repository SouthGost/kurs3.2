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
        const paragraph = document.createElement("p");
        const button = document.createElement("button");

        paragraph.innerText = this.toResource.name;
        button.innerText = "Отмена";
        button.onclick = cancelFunc;
        div.append(paragraph);
        div.append(button);
        return div;
    }

    // createNowDiv(){
    //     const improvingNowTd = document.createElement("div");
    //     const div = document.createElement("div");
    //     const nameParagraph = document.createElement("p");
    //     const timeParagraph = document.createElement("p");
    //     timeParagraph.className = "time_left";

    //     nameParagraph.innerText = this.toResource.name;
    //     timeParagraph.innerText = "00:" + this.time / 1000;
    //     div.append(nameParagraph);
    //     div.append(timeParagraph);
    //     improvingNowTd.append(div);
    //     return improvingNowTd;
    // }
}