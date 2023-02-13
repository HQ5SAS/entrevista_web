
//declaración variables provenienintes del ejs
const video = document.getElementById('video_');
const videoButton= document.getElementById('next_bttn');
var texto =document.getElementById('pregunta_txt');
const cronometro = document.getElementById('timer');
const divVideo= document.getElementById("container_video");
const txtBase64vid= document.getElementById("fileBase64");
const loadImage=document.getElementById("loadImg");
const divPreguntas=document.getElementById("divicionDerecha");
const header_=document.getElementById("header_");
//const body_ =document.getElementById("body_");
//vars
var alertas =document.getElementById("alertas");
var videoUrlglobal="";
var sAux ="0";
var mAux ="0";
var tiempoFin="0";
var preguntas=[
    '¿Cuál es su experiencia previa relevante y qué le llevó a interesarse por este trabajo en particular?',
    '¿Cómo describiría sus fortalezas y habilidades relevantes para este trabajo?',
    '¿Qué expectativas tiene sobre este trabajo y cómo cree que puede contribuir a la empresa?',
    '¿Cómo maneja usted situaciones de alta demanda y plazos ajustados en un entorno de trabajo acelerado?',
    '¿Qué medidas toma para mantener actualizadas sus habilidades y conocimientos relevantes y mejorar continuamente su desempeño en el trabajo?'
]
var countPreguntas=0;
var transcripcion="";
let mediaRecorder;
//--------dominio
const enlace= "https://entrevistas.gestionhq5.com.co";
//-----estilos modif
if (divPreguntas.offsetWidth <"500"){
   divPreguntas.classList.remove('text-bg-dark');
    body_.style.backgroundColor="rgb(240, 240, 240)";
    divVideo.style.height = "30vh";
    video.style.width="250px";
    video.style.marginTop="20px"
    header_.style.display='none';
    texto.style.fontSize= "150%";
    videoButton.style.marginBottom = "10px"
}

//función que acutua de forma secuencial para el btn, 
videoButton.onclick=()=>{

    switch(videoButton.textContent){
        case 'Probar sonido':
            //
            //recognition.start();
            texto.textContent="A continuación le aparecerá una oración, por favor leala en voz alta. Después de click en el botón terminar";
            videoButton.textContent ='Entendido';
            break;
        case 'Entendido':   
            transcripcion="";
            recognition.start();
            texto.textContent="Esto es una prueba";
            setTimeout(function(){
                if(videoButton.textContent ==''){
                    videoButton.textContent ='Terminar';
                }
            }, 6000);
            videoButton.textContent ='';
            break;
        case 'Terminar':      
            recognition.abort();  
            console.log(transcripcion);    
            if(transcripcion.replace('.', '')=="Esto es una prueba"){
                videoButton.textContent ='Listo';
                texto.textContent="A continación se realizará la entrevista vitual. Cuando des click en el botón 'Listo' se comenzará a grabar el video que se toma desde tu dispositivo.La entrvista tiene un tiempo límite de máximo 10 minutos."
            }
            else if(transcripcion==""){
                texto.textContent="intente de nuevo por favor, no se detectó audio"
                videoButton.textContent ='Entendido';
            }
            else{
                texto.textContent="intente de nuevo por favor, revise el ruido del lugar"
                videoButton.textContent ='Entendido';
            }
            break;
        case 'Listo':
            transcripcion="";
            videoButton.textContent ='Siguiente';
            //texto.style.marginTop="40%";
            texto.textContent=preguntas[0];
            //texto.style.fontSize= "250%"
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
                pararCrono();
                recognition.abort();
                clearInterval(id);
                texto.textContent="Espere mientras se carga la entrevista... :)";
                texto.style.marginTop="0%";
                videoButton.style.display='none'; 
                loadImage.style.visibility='visible';
                loadImage.style.height="15%";
                stopRecording();
                    
                    
            }   
            break;   
              
    }
}
//solicita el acceso de audio y video desde la pag web
async function init(){
    loadImage.style.visibility='hidden';
    loadImage.style.height="0px";
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
        var videoUrl=URL.createObjectURL(event.data);
        //video.src="/images/loading.gif";

        var resVideo=""
        try{
  
            const getBlobData = (file) =>{ 
                axios({
                  method: "get",
                  url: file, // blob url 
                  responseType: "blob",
                }).then(function (response) {
                  var reader = new FileReader();
                  reader.readAsDataURL(response.data);
                  reader.onloadend = function () {
                    var base64data = reader.result;
                    const formData = new FormData();
                    formData.append("file", base64data);
                    //console.log(base64data);
                    txtBase64vid.textContent=base64data;
// fetch('entrevistas.gestionhq5.com.co/video', {
                      fetch(enlace+ '/video', {
                            method: 'POST',
                            headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                            body: JSON.stringify({ "url_video": base64data, "transcripcion": transcripcion, "tiempo": tiempoFin})
                        })
                        .then(response => response.json())
                        .then(response => console.log(JSON.stringify(response)))
                        .then( location.replace(enlace+ "/contacto") )//redirige a url de contacto
                  };
                });
              };
              
              getBlobData(videoUrl);
              resVideo = "FUNCIONA";              
              //videoButton.onclick=function(){
              //  location.href= enlace+ "/contacto";
            //}

            }
        
        catch(error) {
          resVideo = error;
        }
        //console.log(resVideo);
        

           
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
    tiempoFin=mAux + "." + sAux;
 } 
 function pararCrono(){
    clearInterval(id);
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
    //console.log("detectando");
    if(videoButton.textContent ==''){
        videoButton.textContent ='Terminar';
    }
    var results = event.results;
    var frase=results[results.length-1][0].transcript;
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
