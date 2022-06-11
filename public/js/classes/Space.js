import * as THREE from 'three';
import { GLTFLoader } from '../../jsm/loaders/GLTFLoader.js';
import Mine from "./Mine.js";
import MainLocation from './MainLocation.js';
import TradeLocation from "./TradeLocation.js";
import HTMLController from './html/HTMLController.js';
import ResourceController from "./ResourceController.js";
import { OrbitControls } from '../../jsm/controls/OrbitControls.js';

export default class Space {
    resize = () => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.currentLocationId = undefined;

        this.canvas.setAttribute('width', this.width + "");
        this.canvas.setAttribute('height', this.height + "");
        this.renderer.setSize(this.width, this.height, false);

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }

    show() {
        this.loop()
    }

    visibleLocation(i) {
        this.htmlController.closeModal();
        if (i < 0 || i >= this.locations.length) {
            throw new Error("Неизвесная локация");
        }
        if (this.currentLocationId != i) {
            if (this.currentLocationId != undefined) {
                this.locations[this.currentLocationId].hide();
            }
            this.scene.clear();
            if (this.mixers.length > 0) {
                this.mixers.splice(0, this.mixers.length);
            }
            this.currentLocationId = i;
            this.locations[i].visible(
                this.renderer,
                this.scene,
                this.camera,
                this.mixers
            );
        }
    }

    constructor(canvas_name) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.canvas = document.getElementById(canvas_name);
        this.canvas.setAttribute('width', this.width + "");
        this.canvas.setAttribute('height', this.height + "");
        
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.shadowMap.enabled = true;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(90, this.width / this.height, 1, 1000)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.clock = new THREE.Clock();
        this.delta;
        this.mixers = [];
        
        const init = () => {
            console.log("init space");
            this.show();
            this.visibleLocation(1);
            const locationButtons = [];
            
            for (let i = 0; i < this.locations.length; i++) {
                const button = document.createElement("button");
                button.innerText = this.locations[i].name;
                button.onclick = () => {
                    this.visibleLocation(i);
                }
                locationButtons.push(button);
            }
            this.htmlController.showLocationSelection(locationButtons);
            
            const text3Paragraph = document.createElement("p");
            text3Paragraph.innerText = `В данной локации вы можете нанимать и увольнять рабочих, открывать новые шахты и распределять среди них рабочих.`;
            
            const start3Button = document.createElement("button");
            start3Button.innerText = "Начать";
            start3Button.onclick = () => {
                this.htmlController.closeModal();
                this.resourceController.startNewMonth();
            }
            
            const text2Paragraph = document.createElement("p");
            text2Paragraph.innerText = `В данной локации вы можете продавать и утелезировать ресурсы. Также тут доступна панель управления обработкой ресурсов.`;
            
            const start2Button = document.createElement("button");
            start2Button.innerText = "Далее";
            start2Button.onclick = () => {
                this.visibleLocation(0);
                this.htmlController.openModal("Локация шахта",[text3Paragraph, start3Button], false);
            }

            const text1Paragraph = document.createElement("p");
            text1Paragraph.innerText = `Приветствуем вас в игре.
            Целью данной игры является достижение экономического баланса по обеспечению работников заработной платой,
            формирование резервных фондов для покрывания затрат на собственные нужды: утилизация отходов, логистика.
            Сделайте так, чтоб шахта проработала несколько веков!`;

            const start1Button = document.createElement("button");
            start1Button.innerText = "Далее";
            start1Button.onclick = () => {
                this.htmlController.openModal("Локация фабрика",[text2Paragraph, start2Button], false);
            }

            //this.htmlController.openModal("Симулятор руководителя шахтой",[text1Paragraph, start1Button], false);
            this.resourceController.startNewMonth() // убрать





            // this.locations[0].work();
        }

        this.manager = new THREE.LoadingManager();
        this.manager.onLoad = init;

        this.gltfLoader = new GLTFLoader(this.manager);
        this.htmlController = new HTMLController();
        this.resourceController = new ResourceController(this.gltfLoader, this.htmlController);
        this.locations = [
            new Mine(this.gltfLoader, this.resourceController, this.htmlController),
            // new MainLocation(this.gltfLoader, this.resourceController, this.htmlController),
            new TradeLocation(this.gltfLoader, this.resourceController, this.htmlController),
        ];

        window.addEventListener('resize', this.resize);
    }

    loop() {
        this.delta = this.clock.getDelta();
        for (const mixer of this.mixers) {
            mixer.update(this.delta);
        }

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => { this.loop(); });
    }

}