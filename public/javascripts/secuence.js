const video = document.getElementById('video_');
const videoButton= document.getElementById('next_bttn');
var texto =document.getElementById('pregunta_txt');
const cronometro = document.getElementById('timer');
const divVideo= document.getElementById("cotainer_video");
var alertas =document.getElementById("alertas");

var preguntas=[
    'Háblame de ti',
    '¿Qué te gusta hacer en tu tiempo libre?',
    '¿Por qué te interesa el puesto?',
    '¿Por qué dejaste tu anterior empleo? ¿Por qué quieres cambiar de empleo?',
    'Cuéntame de algún momento de tu vida laboral en el que hayas cometido un error, ¿cómo lo solucionaste?',
    '¿Cuál es tu mayor virtud o habilidad?',
    '¿Cuál es tu mayor debilidad o defecto?',
    '¿Por qué deberíamos contratarte?'
]
var countPreguntas=0;
var transcripcion="";

let mediaRecorder;
//finción que acutua de forma secuencial para el btn, 
videoButton.onclick=()=>{
    console.log(videoButton.textContent);

    switch(videoButton.textContent){
        case 'Probar sonido':
            var vartranscript = "";
            texto.textContent="A continuación le aparecerán una serie de palabras, por favor leálas en voz alta. Después de click en el botón terminar";
            videoButton.textContent ='Entendido';
            break;
        case 'Entendido':    
            recognition.start();
            texto.textContent="Esto es una prueba"
            videoButton.textContent ='Terminar';
            break;
        case 'Terminar':      
            recognition.abort();  
            if(transcripcion=="Esto es una prueba."){
                videoButton.textContent ='Listo';
                texto.textContent="Recuerda que la entrevista es una herramienta que nos permite conocerte mejor, así que ponte cómodo y ayudanos respondiendo la preguntas que se te harán a continuación :)"
            }
            else {
                texto.textContent="intente de nuevo por favor"
                videoButton.textContent ='Probar sonido';
                console.log(transcripcion);
            }
            break;
        case 'Listo':
            videoButton.textContent ='Siguiente';
            texto.style.marginTop="40%";
            texto.textContent=preguntas[0];
            texto.style.fontSize= "250%"
            recognition.start();
            startRecording();
            nuPregunta=preguntas[0]
            readTxt(nuPregunta);
            cronometrar();
            cronometro.innerHTML="00:00";
            break;
        case 'Siguiente':
            countPreguntas ++;
            if(countPreguntas<preguntas.length)
            {
                nuPregunta=preguntas[countPreguntas];
                texto.textContent=nuPregunta;
                readTxt(nuPregunta);
            }
            else if (countPreguntas==preguntas.length)
            {
                stopRecording();
                videoButton.style.display='none'; 
                recognition.abort();   
                texto.style.fontSize= "150%"
                texto.textContent = texto.textContent="¡Muchas gracias por completar la entrevista! proximamente te contactaremos para informarte del proceso."; 
                console.log(transcripcion);    
                clearInterval(id);
            }
            break;   
              
    }
}
//solicita el acceso de audio y video desde la pag web
async function init(){
    //inicializa cronometro en ceros )
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia(
            {
                audio: true,
                video: true
            }
        );
        startWebCamera(stream);
    }
    catch(e){
        console.log("Error con el dispositivo de video");
        console.log(e);
    }
    m = 0;
    s = 0;
    
    
}

//fn que inicia cámara
function startWebCamera(stream) 
{
    video.srcObject = stream;
    window.stream = stream;
}

function startRecording(){
    if (video.srcObject===null){
        video.srcObject =  window.stream;
    }
    mediaRecorder= new MediaRecorder(window.stream,{mimeType:'video/webm;codecs=vp9'});
    mediaRecorder.start();
    mediaRecorder.ondataavailable = recordVideo;
}

function recordVideo(event){
    if (event.data && event.data.size > 0){
        video.srcObject=null;
        let videoUrl=URL.createObjectURL(event.data);
        video.src=videoUrl;
    }
}
function stopRecording(){
    mediaRecorder.stop();
}
//--Cronómetro
function cronometrar(){
    escribir();
    id = setInterval(escribir,1000);
}
function escribir(){
    var mAux, sAux;
    s++;
    if (s>59){m++;s=0;}

    if (s<10){sAux="0"+s;}else{sAux=s;}
    if (m<10){mAux="0"+m;}else{mAux=m;}

    cronometro.innerHTML = mAux + ":" + sAux; 
 } 
//
init();
//------section transcripcion video
//-verificar acceso a API
try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
    recognition.lang='es-ES';
    recognition.continuous =true;
    recognition.interimResults = false;

  }
  catch(e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
  }
  recognition.onresult = (event) => {
    const results = event.results;
    const frase=results[results.length-1][0].transcript;
    transcripcion += frase;

  }
  //--lectura de texto
  function readTxt(txt){
    const hablar = new SpeechSynthesisUtterance();
    hablar.text = txt;
    hablar.volume =1;
    hablar.rate =1;
    hablar.pitch = 1;
    window.speechSynthesis.speak(hablar);

  }
  //----deteccion de rostro
// Cargar Modelos
// Cargar Modelos
Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri('./javascripts/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./javascripts/models'),
    faceapi.nets.faceLandmark68TinyNet.loadFromUri('./javascripts/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./javascripts/models'),
    faceapi.nets.tinyFaceDetector.loadFromUri('./javascripts/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./javascripts/models')
    
]).then(init);

video.addEventListener('play',  () => {
    countError=0;
    setInterval(async () => {
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