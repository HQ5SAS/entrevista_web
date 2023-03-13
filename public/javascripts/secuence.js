
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
const recGif = document.getElementById("recGif");
const micImg=document.getElementById("mic");
const testConsole=document.getElementById("testConsole");
//vars
const id_= idUser;
const requi=requiUser;

var alertas =document.getElementById("alertas");
var videoUrlglobal="";
var sAux ="0";
var mAux ="0";
var tiempoFin="0";
var preguntas=preguntasList.split(",")
var countPreguntas=0;
var transcripcion="";
let mediaRecorder;
//fn wait
function waitUrlfn(){
    loadImage.style.visibility='hidden';
    texto.textContent="¡Listo! Entrevista enviada exitosamente. Da click en el botón para acceder a nuestra sección de contacto";
    videoButton.textContent ='Contacto';
    alertas.style.visibility='hidden';
    videoButton.style.visibility='visible';
}
//---
async function terminarEntrevista(){
    recGif.style.display='none';
    pararCrono();
    recognition.abort();
    clearInterval(id);
    texto.textContent="Espera mientras se envía la entrevista... :)";
    texto.style.marginTop="0%";
    videoButton.style.visibility='hidden'
    loadImage.style.visibility='visible';
    loadImage.style.height="15%";
    cronometro.style.display='none';          
    stream.getTracks().forEach(function(track) {
        track.stop();
  });  
}
//--------dominio
// https://entrevistas.gestionhq5.com.co
//http://localhost:3060
//https://entrevistastest.gestionhq5.com.co
const enlace= "https://entrevistastest.gestionhq5.com.co";
//-

//-----estilos modif
if (isMobile()){
   divPreguntas.classList.remove('text-bg-dark');
    body_.style.backgroundColor="rgb(240, 240, 240)";
    divVideo.style.height = "30vh";
    video.style.width="250px";
    video.style.marginTop="20px"
    header_.style.display='none';
    texto.style.fontSize= "150%";
    videoButton.style.marginBottom = "10px"
}
//hide elements
micImg.style.display='none'; 
recGif.style.display='none';
//--cuenta regresiva
let seconds = 6;
function cuentaReg(){
    // Actualizamos el elemento de la cuenta regresiva cada segundo
    const countdownTimer = setInterval(() => {
      // Disminuimos el contador de segundos
      seconds--;
      // Actualizamos el elemento de la cuenta regresiva con el número actual de segundos
      texto.textContent = seconds;

      // Si hemos llegado a cero, detenemos el temporizador e inicamos entrevista
      if (seconds <= 0) {
        clearInterval(countdownTimer);
        //instrucciones de inicialización de procesos
        recGif.style.display='block';
        transcripcion="";
        videoButton.textContent ='Siguiente';
        texto.textContent=preguntas[0]+ " .Transcrip:"+ transcripcion;
        try{
        recognition.start();
        }
        catch(err){
            textContent.textContent=err;
        }
        recognition.onend = function() {
            console.info("voice recognition ended, restarting...");
            recognition.start();
        }
        startRecording();
        nuPregunta=preguntas[0]
        readTxt(nuPregunta);
        cronometrar();
        cronometro.innerHTML="00:00";
        videoButton.style.visibility='visible';
      }
    }, 1000);
}    
//función que acutua de forma secuencial para el btn, 

videoButton.onclick=()=>{

    switch(videoButton.textContent){
        case 'Probar sonido':
            texto.textContent='Por favor, lea toda instrucción antes de continuar.\nPrimero de click al botón <<Iniciar prueba>>. \nLuego lea SOLO la oración que se encuentra entre comillas en voz alta. \n Después de click en el botón <<Terminar>> que aparecerá. \nLa oración que debe decir es: "Esto es una prueba"';
            videoButton.textContent ='Listo'; 
            break;
        case 'Iniciar prueba':  

            micImg.style.display='block'; 
            videoButton.style.visibility='hidden';
            micImg.style.display='block'; 
            transcripcion="";
            try{
            recognition.start();
            }
            catch(err){
                testConsole.textContent=err
            }
            setTimeout(function(){
                if(videoButton.style.visibility=='hidden' ){
                    videoButton.textContent ='Terminar';
                    videoButton.style.visibility='visible';
                }
            }, 6000);
            
            break;
        case 'Terminar':     
        micImg.style.display='none'; 
            try{
                recognition.abort();  
            }
            catch(err){
                testConsole.textContent(err);
            }
            
            if(transcripcion.replace('.', '')=="Esto es una prueba"){
                videoButton.textContent ='Listo';
                texto.textContent="A continación se realizará la entrevista virtual. Cuando des click en el botón 'Listo' se comenzará a grabar el video que se toma desde tu dispositivo.La entrevista tiene un tiempo límite de máximo 7 minutos."
            }
            else if(transcripcion==""){
                texto.textContent='Intente de nuevo por favor, no se detectó audio. Lea SOLO la oración que se encuentra entre comillas en voz alta. La oracion que debe decir es: "Esto es una prueba"'
                videoButton.textContent ='Iniciar prueba';
            }
            else{
                texto.textContent='Intente de nuevo por favor, revise el ruido del lugar.\n Lea SOLO la oración que se encuentra entre comillas en voz alta. \n\nLa oracion que debe decir es: "Esto es una prueba"'
                videoButton.textContent ='Iniciar prueba';
            }
            break;
        case 'Listo':
            cuentaReg();
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
                terminarEntrevista().then(stopRecording());     
            }   
            break;  
        case 'Contacto':
            window.location.href = enlace+ '/contacto'
            
        
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
                    console.log(idUser+" req."+requiUser)
                      fetch(enlace+ '/video', {
                            method: 'POST',
                            headers: {  
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ "url_video": base64data, "transcripcion": transcripcion, "tiempo": tiempoFin, "id":id_,"requi:":requi })
                        })
                        .then(response => response.json())
                        .then(waitUrlfn())
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
          console.log(error)
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
    if(m>=7)
    {
        terminarEntrevista();
    }
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
  catch(err) {
    //console.error(e);
    testConsole.textContent=err;
    $('.no-browser-support').show();
    $('.app').hide();
  }
  recognition.onresult = (event) => {
    //console.log("detectando");
    try{
        var results = event.results;
        var frase=results[results.length-1][0].transcript;
        transcripcion += frase;
        testConsole.textContent=transcripcion;
        console.log(transcripcion) ;
    }
    catch(err){
        testConsole.textContent=err;
    }
    
  }
  //--lectura de texto
  function readTxt(txt){
    const hablar = new SpeechSynthesisUtterance();
    hablar.lang= 'es-ES';
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
            alertas.textContent="Aléjate un poco de la cámara";
            alertas.style.display='block'; 
        }
        else if(heightFace <=120){
            alertas.textContent="Acércate un poco a la cámara";
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
    if(countError>5)
    {
            alertas.textContent="¡OH! No te encontramos, ubícate frente a la cámara, revisa si hay mucha o poca luz y cambia de lugar si ese es el caso, por favor no uses objetos que obstruyan tu rostro";
            alertas.style.display='block'; 
            setTimeout(function(){
                countError=0;
            }, 6000); 
               
    }

    },900)

})
//identify mobile
function isMobile(){
    return /Android|iPhone/i.test(navigator.userAgent);
}