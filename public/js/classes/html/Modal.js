export default class Modal {

    constructor() {
        this.modal = document.getElementById("modal");
        this.modalContent = document.getElementById("modal_content");
        this.modalName = document.getElementById("modal_name");
        this.modalCloseButton = document.getElementById("modal_close_button");
        this.modalCloseButton.onclick = () => { this.close() }
    }

    open(name, HTMLElements){
        this.modal.style.visibility = "visible";
        this.modalName.innerText = name;
        for (const element of HTMLElements) {
            this.modalContent.append(element);
        }
    }

    close() {
        this.modal.style.visibility = "hidden";
        this.modalContent.innerHTML = "";
        this.modalName.innerHTML = "";
    }
}