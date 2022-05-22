import Modal from "./Modal.js";
import Message from "./Message.js";
import Content from "./Content.js";

export default class HTMLController{

    constructor(){
        this.modal = new Modal();
        this.message = new Message();
        this.locationSelection = new Content("location_selection");
        this.locationContent = new Content("location_content");
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

    openModal(name, HTMLElements){
        this.modal.open(name, HTMLElements);
    }

    closeModal(){
        this.modal.close();
    }
}