export default class Improve {

    constructor(resourceImprove, fromResource, toResource, time) {
        this.resourceImprove = resourceImprove;
        this.fromResource = fromResource;
        this.toResource = toResource;
        this.time = time;
    }

    do(td) {
        setTimeout(() => {
            this.toResource.addCount(1);
            this.resourceImprove.next(td);
        }, this.time)
    }

    createQueueTd(){
        const nextImproveTd = document.createElement("td");

        nextImproveTd.innerText = this.toResource.name;
        return nextImproveTd;
    }

    createNowTd(){
        const improvingNowTd = document.createElement("td");

        improvingNowTd.innerText = this.toResource.name;
        return improvingNowTd;
    }
}