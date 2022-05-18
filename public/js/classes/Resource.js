import * as SkeletonUtils from '../../jsm/utils/SkeletonUtils.js';

export default class Resource{
    
    constructor(name, name2, url){
        this.name = name;
        this.name2 = name2;
        this.url = url;
        this.count = 0;
        
        const infoContent = document.getElementById("info_content");

        const rowDiv = document.createElement("div");
        rowDiv.className = "row";

        this.resourceNumberParagraph = document.createElement("p");
        this.resourceNumberParagraph.innerText = this.count;

        const resourceNameParagraph = document.createElement("p");
        resourceNameParagraph.innerText = name;

        rowDiv.append(this.resourceNumberParagraph);
        rowDiv.append(resourceNameParagraph);

        infoContent.append(rowDiv);
    }

    changeCount(number){
        if(this.count + number < 0){
            throw new Error("Не достаточно ресурсов");
        }
        this.count+= number;
        this.resourceNumberParagraph.innerText = this.count;
    }

    getObject3D(){
        const object3D = SkeletonUtils.clone(this.scene);
        object3D.name = this.name2;
        // console.log("obect3d",object3D);
        return object3D;
    }
    
}