export default class Money{

    constructor(value){
        this.value = value;

        const infoContent = document.getElementById("info_content");

        const rowDiv = document.createElement("div");
        rowDiv.className = "row";

        this.valueParagraph = document.createElement("p");
        this.valueParagraph.innerText = this.value;

        const textParagraph = document.createElement("p");
        textParagraph.innerText = "₽";

        rowDiv.append(this.valueParagraph);
        rowDiv.append(textParagraph);

        infoContent.append(rowDiv);
    }

    add(value){
        this.value += value;
        this.changeParagraph();
    }

    remove(value){
        if(this.value - value < 0){
            throw new Error("Недостаточно денег");
        }
        this.value -= value;
        this.changeParagraph();
    }

    changeParagraph(){
        this.valueParagraph.innerText = this.value;
    }
}