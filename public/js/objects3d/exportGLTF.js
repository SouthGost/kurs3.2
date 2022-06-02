function exportGLTF(input) {

    const gltfExporter = new GLTFExporter();

    //console.log("povorot",drum_rotation_animation)
    const options = {
        trs: false,
        binary: true,
        onlyVisible: false,
        includeCustomExtensions: true,
        animations : [
            // down_drum_rotation_animation,
            // up_drum_rotation_animation
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

export default exportGLTF;