const {downloadFile} =require("./exportVideo");
var express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');
const { exportsDB } = require("./db");
//const cors = require('cors');
const router = express.Router();
const { spawn } = require("child_process");
const { response } = require("express");
const { render } = require("ejs");
//const host = 'https://entrevistas.gestionhq5.com.co';
const host = 'http://localhost:3060';

//var ID_user ="3960020000016631899";
//var requi = "1234";
con= exportsDB();

//-

//-- funciones 
//get id info
function python_getInfo(content){
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
      console.log(python_response);
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
  //titulo en pestaña 
  res.render('index', { title: 'Consejos' });
  //variables de usuario
  this.ID_user = req.query.id;
  var requi = req.query.requi;
  //python_getInfo({"key":"contenido", "requi": requi});
  console.log('requi:'+ requi+'id:'+ID_user);
});
//---busqueda registro para función sen info (cambia registro de zoho)
// router.get("/zoho/get", function(req, res){
//   console.log("solicitud enviada a python");
//   python_getInfo({"key":"contenido", "id": this.ID_user});
//   res.send("solicitud recibida");
// });

//---finalizar entrevista+
//-fn video
 function saveInformation(req){  
  var resSQL="";
  var resZoho="";
  var resVideo="";
  var urlVideo=req.body.url_video;
  var respuestas =req.body.transcripcion;
  var duracion=req.body.tiempo;
  
  // URL of the video
  var fecha=new Date();
  var dia = fecha.getDate();
  var mes =fecha.getMonth();
  var anio=fecha.getFullYear();
  var hora= (fecha.getHours());
  var minutos=(fecha.getMinutes());
  var segundos=(fecha.getSeconds());

  var fechaFinEntrevista= `${dia}/${mes}/${anio}T${hora}:${minutos}:${segundos}`;
  console.log(fechaFinEntrevista);
  try{
    var sql = "INSERT INTO `defaultdb`.`entrevistas` (`respuestas`, `duracion_entrevista`, `fecha_entrevista`, `aplicar_convocatorias_id`,`entrevistaBase64`) VALUES ('"+respuestas + "', '"+ duracion+ "', '"+fechaFinEntrevista + "', '"+ ID_user+ "', '"+ urlVideo+ "');";
    this.con.query(sql, function (err, result) {
      if (err) throw err; 
      console.log("video guardado en db");
      
    });
    this.con.commit();
      resSQL="succesfull query"; 
  }
  catch (error){
    resSQL =error + " error query:()";
  }
  //obtener preguntas requi ZOHO
  // try{
  //   python_getInfo({"key":"contenido", "requi": requi })
  // }
  // catch (error){
  //   console.log("error get info")
  // }

  //envío de info a zoho--------------------------------------------------------ººººº
  // try{
  //   python_sendInfo({"key":"contenido", "id": ID_user});
     resZoho= "info actualizada zoho"
  // }
  // catch (error){
  //   esZoho=error;
  // }
//-------------------------------------------------------------------
  

//get videoo-----------------------------

//------------------------------------
//--;
  //console.log(url_);
  return({"key":urlVideo, "resSQL":resSQL, "resZoho":resZoho, "resVideo":resVideo});
}
//--video
router.post('/video', function(req, res) {
  

saveInformation(req);
});

router.get('/empezar', function(req, res, next) {
  res.render('empezar', { title: 'Entrevistas HQ5',bttn:"Probar sonido",alerta:"espere un momento por favor",txt_content:"Recuerda que la entrevista es una herramienta que nos permite conocerte mejor, así que ponte cómodo y ayudanos respondiendo la preguntas que se te harán a continuación :)" });
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
  this.con.query(sqlVideo, function (err, result) {
    if (err) throw err; 
    //console.log(result[0]["entrevistaBase64"]);
    var base64video = '"'+result[0]["entrevistaBase64"]+'"';
    res.render('verVideo', { title: 'Video entrevistas HQ5',source_video:'<source type="video/webm" src= '+base64video+' >'  });
  });

    resSQL="succesfull query"; 
});