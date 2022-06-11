
export default class Message{

    constructor(){
        this.messageContainer = document.getElementById("message_container");
        this.backgroundColor = "rgba(255, 255, 255, 0.37)";
    }

    setBackgroundColor(color){
        this.backgroundColor = color;
        const messages = [...document.getElementsByClassName("message")];
        for (const message of messages) {
            message.style.backgroundColor = this.backgroundColor;
        }
    }

    notify(text){
        const messageDiv = document.createElement("div");
        messageDiv.style.backgroundColor = this.backgroundColor;
        messageDiv.className += "message";

        const paragraph = document.createElement("p");
        paragraph.innerText = text;
        messageDiv.append(paragraph);

        this.messageContainer.append(messageDiv);

        setTimeout(() =>{
            this.messageContainer.removeChild(messageDiv);
        }, 5000);
    }

}