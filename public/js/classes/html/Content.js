

export default class Content{

    constructor(name){
        this.container = document.getElementById(name)
    }

    show(elements){
        this.container.innerHTML = "";
        for (const elem of elements) {
            this.container.append(elem);
        }
    }
}