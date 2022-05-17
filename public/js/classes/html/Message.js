
export default class Message{

    constructor(){
        this.messageContainer = document.getElementById("message_container");
    }

    notify(text){
        const messageDiv = document.createElement("div");
        messageDiv.className += "message";

        const paragraph = document.createElement("p");
        paragraph.innerText = text;
        messageDiv.append(paragraph);

        this.messageContainer.append(messageDiv);

        setTimeout(() =>{
            this.messageContainer.removeChild(messageDiv);
        }, 2000);
    }

}