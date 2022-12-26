// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
const video = document.getElementById('video_');

const tensor = require('@tensorflow/tfjs-node')
// import '@tensorflow/tfjs-node';

//import * as faceapi from 'face-api.js';
const faceapi=require('face-api.js')


/*
await faceapi.detectAllFaces(video, new faceapi.SsdMobilenetv1Options())
await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
await faceapi.detectAllFaces(video, new faceapi.MtcnnOptions())
*/
video.addEventListener('play',  () => {
    countError=0;
    setInterval(async () => {
        const detection = await faceapi.detectSingleFace(video)
        await faceapi.loadSsdMobilenetv1Model('/models')
        await faceapi.loadTinyFaceDetectorModel('/models')
        await faceapi.loadMtcnnModel('/models')
        await faceapi.loadFaceLandmarkModel('/models')
        await faceapi.loadFaceLandmarkTinyModel('/models')
        await faceapi.loadFaceRecognitionModel('/models')
        await faceapi.loadFaceExpressionModel('/models')
        // hacer las detecciones de cara
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        try{
        var heightFace=detections["0"]["landmarks"]["_imgDims"]["_height"];
        
        if (heightFace >=290){
            alertas.textContent="Alejese un poco de la cámara por favor";
            alertas.style.display='block'; 
        }
        else if(heightFace <=120){
            alertas.textContent="Acerquese un poco a la cámara por favor";
            alertas.style.display='block'; 
        }
        else{
            alertas.textContent="";
            alertas.style.display='none'; 
        }
    }
    catch (error){
        countError ++;
    }
       // console.log (detections["0"]);
    if(countError>4)
    {
        alertas.textContent="oh! no te encontramos, ubícate frente a la cámara, revisa si hay mucha o poca luz y cambia de lugar si ese es el caso, por favor no uses objetos que obstruyan tu rostro";
            alertas.style.display='block'; 
        countError=0;    
    }

    },900)

})