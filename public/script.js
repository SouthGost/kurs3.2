import * as THREE from 'three'
import { PointerLockControls } from './jsm/controls/PointerLockControls.js';
import {GLTFLoader} from './jsm/loaders/GLTFLoader.js';
import { clone } from './jsm/utils/SkeletonUtils.js';



const canvas = document.getElementById('canvas');
let width = window.innerWidth;
let height = window.innerHeight;

canvas.setAttribute('width', width);
canvas.setAttribute('height', height);

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setClearColor(0x000000);

const scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000)
camera.position.set(0, 0, 1000);

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);




const startButton = document.getElementById("menu_start_button");
const menuLoading = document.getElementById("menu_loading");
const menu = document.getElementById("menu");
// const models = {
//     flamingo: {
//         url: '/models/flamingo.glb'
//     },
// };

// function init() {
//     menuLoading.style.display = "none";
//     startButton.style.display = "block";

//     Object.values(models).forEach((model, index) => {
//         const clonedScene = clone(model.gltf.scene);
//         const root = new THREE.Object3D();
//         root.add(clonedScene);
//         scene.add(root);
//         root.position.x = (index -3) * 3;
//     });
// }

// const manager = new THREE.LoadingManager();
// manager.onLoad = init;


// const gltfLoader = new GLTFLoader(manager);
// for (const model of Object.values(models)) {
//     gltfLoader.load(model.url, (gltf) => {
//         model.gltf = gltf;
//     });
// }

const objLoader = new THREE.ObjectLoader();
objLoader.setPath('/models/');
objLoader.load('tinker.obj', (object) => {
    scene.add(object);
})

const geometry = new THREE.SphereGeometry(300, 30, 30);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

// for(let i = 0; i < geometry.faces.length; i++) {
//     geometry.faces[i].color.setRGB(Math.random(),Math.random(),Math.random());
// }

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const usedKeys = {}; // You could also use an array
onkeydown = onkeyup = function (e) {
    // console.log(e.keyCode)
    e = e || event; // to deal with IE
    usedKeys[e.keyCode] = e.type == 'keydown';
}



const controls = new PointerLockControls(camera, document.body);

startButton.onclick = () => {
    controls.lock();
}

controls.addEventListener('lock', function () {

    menu.style.visibility = 'hidden';
});

controls.addEventListener('unlock', function () {

    menu.style.visibility = 'visible';
});

window.addEventListener('resize', function (event) {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    renderer.setSize(width, height, false);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

function loop() {
    if (controls.isLocked) {
        let forward = 10;
        let sideways = 7;
        if (usedKeys[16]) {
            forward *= 2;
            sideways *= 2;
        }
        // mesh.rotation.y += 0.01;
        if (usedKeys[87]) {
            controls.moveForward(forward);
        }
        if (usedKeys[83]) {
            controls.moveForward(-forward);
        }
        if (usedKeys[65]) {
            controls.moveRight(-sideways)
            // camera.position.x -= sideways;
        }
        if (usedKeys[68]) {
            controls.moveRight(sideways)
            // camera.position.x += sideways;
        }
    }

    mesh.rotation.y += 0.01;

    renderer.render(scene, camera);
    requestAnimationFrame(function () { loop(); });
}

loop();