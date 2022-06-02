import * as THREE from 'three'
import { GLTFLoader } from '../../jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from '../../jsm/exporters/GLTFExporter.js';
import exportGLTF from './exportGLTF.js';

const manager = new THREE.LoadingManager();
const actions = [];
const clock = new THREE.Clock();
let object3D = new THREE.Object3D();
const times = [0, 1, 2, 3, 4];
const values1 = [
    0, 0, 1, 0, //начало 1
    0, 0, 1, Math.PI / 2,
    0, 0, 1, Math.PI,
    0, 0, 1, 3 * Math.PI / 2,
    0, 0, 1, 2 * Math.PI
];
const down_drum_rotation_KF = new THREE.QuaternionKeyframeTrack(
    'down_drum.quaternion',
    times,
    values1
);
const up_drum_rotation_KF = new THREE.QuaternionKeyframeTrack(
    'up_drum.quaternion',
    times,
    values1
);
const down_drum_rotation_animation = new THREE.AnimationClip('down_drum.rotation_animation', -1, [down_drum_rotation_KF]);
const up_drum_rotation_animation = new THREE.AnimationClip('up_drum.rotation_animation', -1, [up_drum_rotation_KF]);

function init() {
    

    // exportGLTF(object3D)
    // console.log("старый", object3D)
}

manager.onLoad = init;



const gltfLoader = new GLTFLoader(manager);
const blocks = [
    {
        name: "minecart",
        url: "mine/minecart.glb"
    },
];



gltfLoader.load(`/models/${blocks[0].url}`, (gltf) => {
    const root = gltf.scene;
    // console.log("drum",root)

    root.name = blocks[0].name;
    blocks[0].scene = root;
    root.position.set(-5, 8, 5);
    // const mixer = new THREE.AnimationMixer(root);
    root.animations.push(down_drum_rotation_animation)
    // actions.push(mixer.clipAction(drum_rotation_animation))
    // console.log("Анимации", )

    object3D.add(root);
    //
});
// gltfLoader.load(`/models/${blocks[1].url}`, (gltf) => {
//     const root = gltf.scene;
    
//     root.name = blocks[1].name;
//     blocks[1].scene = root;
//     root.position.set(13, 28, 5);
//     root.animations.push(up_drum_rotation_animation)

//     object3D.add(root);
//     //
// });
// gltfLoader.load(`/models/${blocks[2].url}`, (gltf) => {
//     const root = gltf.scene;
//     blocks[2].scene = root;
//     root.name = blocks[2].name;
//     object3D.add(root);
//     //
// });

//Save this mixer somewhere


export default object3D;