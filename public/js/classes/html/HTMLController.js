import Modal from "./Modal.js";
import Message from "./Message.js";

export default class HTMLController{

    constructor(){
        this.modal = new Modal();
        this.message = new Message();
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