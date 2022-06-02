import * as THREE from 'three'
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from './jsm/utils/SkeletonUtils.js';
import Stats from './jsm/libs/stats.module.js'
import exportModel from './js/objects3d/objectConstructor.js'

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

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setClearColor(0x00FFFF);

const scene = new THREE.Scene();

// const spotLight = new THREE.SpotLight( 0xffffff );
// spotLight.angle = Math.PI / 5;
// spotLight.penumbra = 0.2;
// spotLight.position.set( 2, 3, 3 );
// spotLight.castShadow = true;
// spotLight.shadow.camera.near = 3;
// spotLight.shadow.camera.far = 10;
// spotLight.shadow.mapSize.width = 1024;
// spotLight.shadow.mapSize.height = 1024;
// scene.add( spotLight );

const dirLight = new THREE.DirectionalLight(0x55505a, 1);
dirLight.position.set(0, 100, 40);
dirLight.castShadow = true;
dirLight.shadow.camera.near = 1;
dirLight.shadow.camera.far = 10;

dirLight.shadow.camera.right = 1;
dirLight.shadow.camera.left = - 1;
dirLight.shadow.camera.top = 1;
dirLight.shadow.camera.bottom = - 1;

dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
scene.add(dirLight);

let camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000)
camera.position.set(0, 20, 50);

const light = new THREE.HemisphereLight(0xFFE4B5, 0x000000, 1);
scene.add(light);


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

const geometry = new THREE.BoxGeometry(1.7, 1, 3.1);
const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: false });


const mesh = new THREE.Mesh(geometry, material);
// mesh.position.set(-1.2, 0.8, -1.9);

let minecart;
const mixers = [];

const times = [0, 2];
const values2 = [
    0, 0, 0,
    0, 0, 40
];

function init() {
    const minecartMove_KF = new THREE.VectorKeyframeTrack('.position', times, values2);
    const minecartMove_animation = new THREE.AnimationClip('.position_animation', -1, [minecartMove_KF]);
    const mixer = new THREE.AnimationMixer(minecart);
    mixers.push(mixer);
    const action = mixer.clipAction(minecartMove_animation);

    action.setLoop(THREE.LoopOnce);
    action.clampWhenFinished = false;

    action.play();
    mixer.addEventListener('finished', function (e) {
        const heap = minecart.getObjectByName("heap"); 
        console.log(heap);
        minecart.remove(heap);
    });
}

const manager = new THREE.LoadingManager();
manager.onLoad = init;
const gltfLoader = new GLTFLoader(manager);

gltfLoader.load(`/models/mine/minecart.glb`, (gltf) => {
    minecart = gltf.scene;
    minecart.name = 'minecart'
    console.log("minecart", minecart)
    // for (const animation_ of gltf.animations) {
    //     const objectName = animation_.name.split(".")[0];
    //     const animatedObject = hoist.getObjectByName(objectName)
    //     const mixer = new THREE.AnimationMixer(animatedObject);
    //     mixers.push(mixer);
    //     const action = mixer.clipAction(animation_);
    //     action.play();
    // }

    scene.add(minecart);
    // console.log(dumpObject(hoist).join('\n'));
});
gltfLoader.load(`/models/mine/heap2.glb`, (gltf) => {
    const root = gltf.scene;
    root.name = 'heap'


    minecart.add(root);
});





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