import Modal from "./Modal.js";
import Message from "./Message.js";
import Content from "./Content.js";

export default class HTMLController{

    constructor(){
        this.header = document.getElementById("header");
        this.modal = new Modal();
        this.message = new Message();
        this.locationSelection = new Content("location_selection");
        this.locationContent = new Content("location_content");

    }

    setBackgroundColor(color){
        this.header.style.backgroundColor = color;
        this.message.setBackgroundColor(color);
    }

    showLocationContent(elements){
        this.locationContent.show(elements);
    }

    showLocationSelection(elements){
        this.locationSelection.show(elements);
    }

    notifyMessage(text){
        this.message.notify(text);
    }

    openModal(name, elements, isCanСlose = true){
        this.modal.open(name, elements , isCanСlose);
    }

    closeModal(){
        this.modal.close();
    }
}