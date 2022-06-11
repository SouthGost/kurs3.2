export default class Timer {
    constructor(afterEnd, time /*в миллисекундах*/) {
        this.time = time;
        this.afterEnd = afterEnd;
        this.paragraph = document.createElement("p");
        this.paragraph.innerText = Timer.getTimeString(time);
    }

    static getTimeString(time){
        let min = Math.floor(time/60_000);
        let sec = Math.floor((time - (min*60_000))/1000);
        if(min.toString().length == 1){
            min = `0${min}`;
        }
        if(sec.toString().length == 1){
            sec = `0${sec}`;
        }

        return `${min}:${sec}`;
    }

    start() {
        let passedTime = 0;
        const interval = setInterval(() => {
            if (passedTime + 1000 < this.time) {
                passedTime += 1000;
            } else {
                passedTime = this.time;
            }
            this.paragraph.innerText = Timer.getTimeString(this.time - passedTime);
        }, 1000);
        setTimeout(() => {
            clearInterval(interval);
            this.afterEnd();
        }, this.time)
    }
}