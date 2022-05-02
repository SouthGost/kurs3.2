import * as THREE from 'three'
import { PointerLockControls } from './jsm/controls/PointerLockControls.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';

const usedKeys = {};
onkeydown = onkeyup = function (e) {
    // console.log(e.keyCode)
    e = e || event;
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

function loop() {
    if (controls.isLocked) {
        let forward = 2;
        let sideways = 1;
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

    // if (cars) {
    //     for (const car of cars.children) {
    //         car.position.x += 1;
    //     }
    // }
    // mesh.rotation.y += 0.01;

    renderer.render(scene, camera);
    requestAnimationFrame(function () { loop(); });
}

loop();