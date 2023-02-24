const {downloadFile} =require("./exportVideo");
var express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');
const { exportsDB } = require("./db");
const con= exportsDB();
const router = express.Router();
const { spawn, ChildProcess } = require("child_process");
const { fork } = require("child_process")
const { response } = require("express");
const { render } = require("ejs");
const { resolve } = require("path");
const { rejects } = require("assert");
const { Console } = require("console");


//const host = 'https://entrevistas.gestionhq5.com.co';
const host = 'http://localhost:3060';

//-

//-- funciones 
//get id info
function python_getInfo(content, res,ID_userEmp,requiEmp){
  //subproceso python fn
   pythonProcess = spawn("python", ["./libs_python/getinfo.py"]);
  var python_response = "";

  pythonProcess.stdout.on("data", function (data) {
    python_response += data.toString();
  });

  pythonProcess.stderr.on('data', function(data){
    console.error(data.toString());
  })

  pythonProcess.stdout.on("end", function(){
      x=JSON.parse(python_response )
      console.log(x);
      function loadPage(){
        res.render('empezar', {
          title: 'Entrevistas HQ5',
          bttn:"Probar sonido",
          alerta:"Espera un momento mientras cargan la configuraciones de cámara",
          txt_content:"Recuerda que la entrevista es una herramienta que nos permite conocerte mejor, así que ponte cómodo y ayudanos respondiendo las preguntas que se te harán a continuación :)",
          idUser: ID_userEmp,
          requiUser: requiEmp,
          preguntasList:x
        });  
      }
      if(python_response.includes('err')){
        res.render('error')
      }
      else{
        loadPage()
      }
      
  });

  pythonProcess.stdin.write(JSON.stringify(content));
  pythonProcess.stdin.end();
}
//---send info zoho fn
function python_sendInfo(content){
  //subproceso python 
   pythonProcess = spawn("python", ["./libs_python/sendinfo.py"]);
  var python_response = "";

  pythonProcess.stdout.on("data", function (data) {
    python_response += data.toString();
  });

  pythonProcess.stderr.on('data', function(data){
    console.error(data.toString());
  })

  pythonProcess.stdout.on("end", function(){
      console.log(python_response);
  });

  pythonProcess.stdin.write(JSON.stringify(content));
  pythonProcess.stdin.end();
}
//------pagina principal
router.get('/', function(req, res, next) {
   //variables de usuario
   this.ID_user = req.query.id;
   var requi = req.query.requi;
  //titulo en pestaña envío de variables para url
  res.render('index', { title: 'Consejos', idHTML: ID_user, requiHTML:requi});
 
});
//---busqueda registro para función sen info (cambia registro de zoho)

//---finalizar entrevista


//-fn video
function saveInformation(req){  
  var resSQL="";
  var urlVideo=req.body.url_video;
  var respuestas =req.body.transcripcion;
  var duracion=req.body.tiempo;
  var id_=req.body.id;
  // get date
  var fecha=new Date();
  var dia = fecha.getDate();
  var mes =fecha.getMonth();
  var anio=fecha.getFullYear();
  var hora= (fecha.getHours());
  var minutos=(fecha.getMinutes());
  var segundos=(fecha.getSeconds());
  var fechaFinEntrevista= `${dia}/${mes}/${anio}T${hora}:${minutos}:${segundos}`;
  var sql = "INSERT INTO `entrevistas` (`respuestas`, `duracion_entrevista`, `fecha_entrevista`, `aplicar_convocatorias_id`,`entrevistaBase64`) VALUES ('"+respuestas + "', '"+ duracion+ "', '"+fechaFinEntrevista + "', '"+ id_+ "', '"+ urlVideo+ "');";
  try{   
      con.query(sql, function (err, result) {
        if (err) throw err; 
        console.log("video guardado en db");
        
      });
    // con.commit();
        resSQL="succesfull query"; 
    }
    catch (error){
      resSQL =error + " error query:()";
    }
      return resSQL 
}
 //   //envío de info a zoho--------------------------------------------------------
function sendZoho(req){
var id_=req.body.id;
try{
  python_sendInfo({"key":"contenido", "id": id_});
  resZoho= "zoho actualizado"
  }
  catch (error){
    resZoho=error;
  }
  return(resZoho);
}
//zoho 
//obtener preguntas requi ZOHO
//   try{
//     python_getInfo({"key":"contenido", "requi": requi })
//   }
//   catch (error){
//     console.log("error get info")
//   }


  
//--video
router.post('/video', function(req, res) {
  const enviarVideo= new Promise((resolve, reject)=>{
    var responseSQL=saveInformation(req);
    if(responseSQL== "succesfull query"){
    resolve('enviado')
    }
    else{
    reject(new Error('error de guardado'));
    console.log(responseSQL)
    }
    
  })
  
  async function guardarEntrevista (){
    try{
      const estado= await enviarVideo.then(sendZoho(req));
      console.log('guardao exitoso: '+estado);
    }
    catch(err){
      console.log(err);
    }
  }
  guardarEntrevista();


});
var apiCall=""
router.get('/empezar', function(req, res, next) {
  var ID_userEmp = req.query.id;
  var requiEmp = req.query.requi;
  const getList= new Promise((resolve, reject)=>{  
    python_getInfo({"key":"contenido", "requi": requiEmp },res,ID_userEmp,requiEmp);
    resolve('Preguntas cargadas')  
  })

  
}); 

router.get('/contacto', function(req, res, next) {
  res.render('contacto', { title: 'Contacto HQ5' });
});
module.exports = router;

//------------------------------
//see videoo-----------------------------
//-----------------------------------------------
router.get('/vd6839h5kl', function(req, res, next) {
  
  //variables de usuario
  this.ID_user = req.query.id;
  this.requi = req.query.requi;

  let sqlVideo= "SELECT `entrevistaBase64` FROM defaultdb.entrevistas WHERE `aplicar_convocatorias_id` = "+ ID_user+";"
  con.query(sqlVideo, function (err, result) {
    if (err) throw err; 
    var base64video = '"'+result[0]["entrevistaBase64"]+'"';
    res.render('verVideo', { title: 'Video entrevistas HQ5',source_video:'<source type="video/webm" src= '+base64video+' >'  });
  });

    resSQL="succesfull query"; 
});
