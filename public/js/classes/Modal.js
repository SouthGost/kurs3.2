export default class Modal {

    constructor() {
        this.modal = document.getElementById("modal");
        this.modalContent = document.getElementById("modal_content");
        this.modalName = document.getElementById("modal_name");
        this.modalCloseButton = document.getElementById("modal_close_button");
        this.modalCloseButton.onclick = () => { this.close() }
    }

    close() {
        this.modal.style.visibility = "hidden";
        this.modalContent.innerHTML = "";
        this.modalName.innerHTML = "";
    }
}