import * as THREE from 'three'
import { GLTFLoader } from '../../jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from '../../jsm/exporters/GLTFExporter.js';

const manager = new THREE.LoadingManager();
const actions = [];
const clock = new THREE.Clock();
let hoist = new THREE.Object3D();
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
    function exportGLTF(input) {

        const gltfExporter = new GLTFExporter();

        //console.log("povorot",drum_rotation_animation)
        const options = {
            trs: false,
            binary: true,
            onlyVisible: false,
            includeCustomExtensions: true,
            animations : [
                down_drum_rotation_animation,
                up_drum_rotation_animation
            ],
        };
        gltfExporter.parse(
            input,
            function (result) {

                if (result instanceof ArrayBuffer) {

                    saveArrayBuffer(result, 'scene.glb');

                } else {

                    const output = JSON.stringify(result, null, 2);
                    console.log(output);
                    saveString(output, 'scene.gltf');

                }

            },
            function (error) {

                console.log('An error happened during parsing', error);

            },
            options
        );

    }

    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);// Firefox workaround, see #6594


    function save(blob, filename) {

        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();

        // URL.revokeObjectURL( url ); breaks Firefox...

    }

    function saveString(text, filename) {

        save(new Blob([text], { type: 'text/plain' }), filename);

    }


    function saveArrayBuffer(buffer, filename) {

        save(new Blob([buffer], { type: 'application/octet-stream' }), filename);

    }

    // exportGLTF(hoist)
    // console.log("старый", hoist)
}

manager.onLoad = init;



const gltfLoader = new GLTFLoader(manager);
const blocks = [
    {
        name: "down_drum",
        url: "down_drum.glb"
    },
    {
        name: "up_drum",
        url: "upper_drum.glb"
    },
    {
        name: "hoist_drumless",
        url: "hoist_drumless.glb"
    },
];



gltfLoader.load(`/models/hoist/${blocks[0].url}`, (gltf) => {
    const root = gltf.scene;
    // console.log("drum",root)

    root.name = blocks[0].name;
    blocks[0].scene = root;
    root.position.set(-5, 8, 5);
    // const mixer = new THREE.AnimationMixer(root);
    root.animations.push(down_drum_rotation_animation)
    // actions.push(mixer.clipAction(drum_rotation_animation))
    // console.log("Анимации", )

    hoist.add(root);
    //
});
gltfLoader.load(`/models/hoist/${blocks[1].url}`, (gltf) => {
    const root = gltf.scene;
    
    root.name = blocks[1].name;
    blocks[1].scene = root;
    root.position.set(13, 28, 5);
    root.animations.push(up_drum_rotation_animation)

    hoist.add(root);
    //
});
gltfLoader.load(`/models/hoist/${blocks[2].url}`, (gltf) => {
    const root = gltf.scene;
    blocks[2].scene = root;
    root.name = blocks[2].name;
    hoist.add(root);
    //
});

//Save this mixer somewhere


export default hoist;