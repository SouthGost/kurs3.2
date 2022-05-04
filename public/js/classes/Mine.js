import Space from "./Space.js"
import MineMatrix from "./MineMatrix.js"
import * as THREE from 'three'
import { OrbitControls } from '../../jsm/controls/OrbitControls.js';

export default class Mine extends Space {

    constructor(canvas_name) {
        super(canvas_name)
        this.renderer.setClearColor(0x000000);
        this.camera.position.set(10, 10, 10);
        this.light = new THREE.HemisphereLight(0xFFE4B5, 0x000000, 1);
        this.scene.add(this.light);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.isInited = false;
        this.manager.onLoad = this.init;

        this.blocks = [
            {
                name: "Ground",
                url: "ground.glb",
                // scene: undefined,
            },
            {
                name: "Gravy",
                url: "gravy.glb",
                // scene: undefined,
            },
            {
                name: "Jewel gravy",
                url: "jewel_gravy.glb",
                // scene: undefined,
            },
            {
                name: "Jewel ground",
                url: "jewel_ground.glb",
                // scene: undefined,
            }
        ];

        for (let i = 0; i < this.blocks.length; i++) {
            this.gltfLoader.load(`/models/block/${this.blocks[i].url}`, (gltf) => {
                this.blocks[i].scene = gltf.scene;
            });
        }
        this.gltfLoader.load(`/models/location/Galerie.glb`, (gltf) => {
            const root = gltf.scene;
            root.position.set(6, -2, 26);
            this.scene.add(root);
        });
        this.gltfLoader.load(`/models/miner/scene.gltf`, (gltf) => {
            const root = gltf.scene;
            root.position.set(0, 0, 4)
            this.scene.add(root);
        });
    }

    loop = () => {
        this.renderer.render(this.scene, this.camera);

        if (this.isShow) {
            requestAnimationFrame(() => { this.loop(); });
        }
    }

    init = () => {
        console.log("Загрузил");
        this.mineMatrix = new MineMatrix(this.scene, this.blocks);
        // this.matrica = new Array(4);
        // for (let i = 0; i < this.matrica.length; i++) {
        //     this.matrica[i] = new Array(4);
        //     for (let j = 0; j < this.matrica[i].length; j++) {
        //         this.matrica[i][j] = new Array(2);
        //         for (let k = 0; k < this.matrica[i][j].length; k++) {
        //             const root = SkeletonUtils.clone(this.blocks[random(0, this.blocks.length - 1)].scene);
        //             root.position.set(i * 2, j * 2, k * 2);
        //             this.matrica[i][j][k] = root;
        //             this.scene.add(root);
        //         }
        //     }

        // }
        this.show();
        this.work();
    }

    work = () => {

        this.mineMatrix.work();
    }







    // init() {

    // }
}