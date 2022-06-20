function getTimeString(time){
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

export default class Timer {
    constructor(afterEnd, time) {
        this.afterEnd = afterEnd;
        this.time = time;
        this.paragraph = document.createElement("p");
        this.paragraph.innerText = getTimeString(time);
    }


    start() {
        let passedTime = 0;
        const interval = setInterval(() => {
            if (passedTime + 1000 < this.time) {
                passedTime += 1000;
            } else {
                passedTime = this.time;
            }
            this.paragraph.innerText = getTimeString(this.time - passedTime);
        }, 1000);
        setTimeout(() => {
            clearInterval(interval);
            this.afterEnd();
        }, this.time)
    }
}