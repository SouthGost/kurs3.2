import * as THREE from 'three'
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from './jsm/utils/SkeletonUtils.js';
import Stats from './jsm/libs/stats.module.js'
import old_hoist from './js/objects3d/hoist.js'

function random(a, b) {
    if (a > b) {
        throw new Error('a > b');
    }
    if (a == b) {
        return a;
    }
    return Math.round(Math.random() * (b - a) + a);
}


const canvas = document.getElementById('canvas');
let width = window.innerWidth;
let height = window.innerHeight;

canvas.setAttribute('width', width);
canvas.setAttribute('height', height);

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setClearColor(0x00FFFF);

const scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000)
camera.position.set(0, 0, 100);
// camera.rotation.set(-0.51,0,0.12);

const light = new THREE.HemisphereLight(0xFFE4B5, 0x000000, 1);
scene.add(light);


// const startButton = document.getElementById("menu_start_button");
// const menuLoading = document.getElementById("menu_loading");
// const menu = document.getElementById("menu");

function dumpObject(obj, lines = [], isLast = true, prefix = '') {
    const localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
        const isLast = ndx === lastNdx;
        dumpObject(child, lines, isLast, newPrefix);
    });
    return lines;
}

let hoist;
const mixers = [];

function init() {

}

const manager = new THREE.LoadingManager();
manager.onLoad = init;
const gltfLoader = new GLTFLoader(manager);
// const url = '/models/miner/scene.gltf';
// const location = [
//     {
//         name: "Main",
//         url: "Galerie.glb"
//     }
// ]
gltfLoader.load(`/models/hoist_full/hoist.glb`, (gltf) => {
    hoist = gltf.scene;
    // hoist.name = 'hoist'
    for (const animation_ of gltf.animations) {
        const objectName = animation_.name.split(".")[0];
        const animatedObject = hoist.getObjectByName(objectName)
        const mixer = new THREE.AnimationMixer(animatedObject);
        mixers.push(mixer);
        const action = mixer.clipAction(animation_);
        action.play();
    }

    scene.add(hoist);
    // console.log(dumpObject(hoist).join('\n'));
});

// const blocks = [
//     {
//         name: "Down drum",
//         url: "down_drum.glb"
//     },
//     {
//         name: "Upper drum",
//         url: "upper_drum.glb"
//     },
//     {
//         name: "Hoist drumless",
//         url: "hoist_drumless.glb"
//     },
// ];

const geometry = new THREE.SphereGeometry(300, 30, 30);
const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });


const mesh = new THREE.Mesh(geometry, material);
// const euler = new THREE.Euler(0, 0, 0, 'XYZ');
// const quaternion = new THREE.Quaternion();
// quaternion.setFromEuler(euler);
// mesh.applyQuaternion(quaternion);

// const times = [0, 1, 2, 3, 4];

// const values2 = [
//     0, 0, 0,
//     -50, 0, 0,
//     -100, 0, 0,
//     -50, 0, 0,
//     0, 0, 0
// ];

// const values = [
//     0, 0, 1, 0,
//     0, 0, 1, 2 * Math.PI,
//     0, 0, 1, 4 * Math.PI,
//     0, 0, 1, 6 * Math.PI
// ];
// const values1 = [
//     0, 0, 1, 0, //начало 1
//     0, 0, 1, Math.PI / 2,
//     0, 0, 1, Math.PI,
//     0, 0, 1, 3 * Math.PI / 2,
//     0, 0, 1, 2 * Math.PI
// ];
// // hoist.quaternion.set(0, 0, 1, 2 * Math.PI)

// const timesO = [0, 3, 6];
// const valuesO = [0, 0, 0, 2, 2, 2, 0, 0, 0];

const clock = new THREE.Clock();
// const rotationZ_KF = new THREE.QuaternionKeyframeTrack(
//     '.quaternion',
//     times,
//     values1,
//     1488
//     // new THREE.LinearInterpolant(
//     //     new Float32Array(2),
//     //     new Float32Array(2),
//     //     1,
//     //     new Float32Array(1)
//     // )
// );


// const usedKeys = {};
// onkeydown = onkeyup = function (e) {
//     // console.log(e.keyCode)
//     e = e || event;
//     usedKeys[e.keyCode] = e.type == 'keydown';
// }

const controls = new OrbitControls(camera, renderer.domElement);

window.addEventListener('resize', function (event) {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    renderer.setSize(width, height, false);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
let delta = clock.getDelta();

function loop() {
    // console.log("кадер")

    delta = clock.getDelta();
    for (const mixer of mixers) {
        mixer.update(delta);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(function () { loop(); });
}

loop();