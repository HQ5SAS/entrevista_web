const {downloadFile} =require("./exportVideo");
var express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');
const { exportsDB } = require("./db");
const con= exportsDB();
const router = express.Router();
const { spawn, ChildProcess } = require("child_process");
const { StringDecoder } = require('node:string_decoder');

//const host = 'https://entrevistas.gestionhq5.com.co';
//http://localhost:3060'
const host = 'https://entrevistas.gestionhq5.com.co';
const dictionary = {
  "aaa":"á",
  "eee":"é",
  "iii":"í",
  "ooo":"ó",
  "uuu":"ú",
  "ppp":"¿",
  "uuum":"ü",
  "NNN":"Ñ",
  "AAA":"Á",
  "EEE":"É",
  "III":"Í",
  "OOO":"Ó",
  "UUU":"Ú",
  "UUUM":"Ü",
  "nnn":"ñ"
 }
 function allReplace(str) {
  for (const x in dictionary) {
    str = str.replace(new RegExp(x, 'g'), dictionary[x]);
  }
  return str;
};
//-errores
const err500= '<img class="image-404" src="../../images/500err.svg" width="500px">';
const err400= '<img class="image-404" src="../../images/400.svg" width="500px">';


//-- funciones 
//--error
function errores(res, err){
  res.render('500err', {type_err:err});
}

  //get id info
  async function python_getInfo(content, lista){
  
    //subproceso python fn
     pythonProcess = spawn("python3", ["./libs_python/getinfo.py"]);
      var python_response = "";
  
    pythonProcess.stdout.on("data", function (data) {  
      python_response += data    
    });
  
    pythonProcess.stderr.on('data', function(data){
      console.error(data.toString());
    })
    
    pythonProcess.stdout.on("end", function(){
      listaP=allReplace(python_response)
      lista(listaP)
    });
    pythonProcess.stdin.setEncoding = 'utf-8';
    pythonProcess.stdin.write(JSON.stringify(content));
    pythonProcess.stdin.end();
    
  }

//---send info zoho fn
function python_sendInfo(content){
  //subproceso python 
   pythonProcess = spawn("python3", ["./libs_python/sendinfo.py"]);
  var python_response = "";

  pythonProcess.stdout.on("data", function (data) {
    python_response += data;
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
  var mes =fecha.getMonth()+1;
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

//------pagina principal
router.get('/', function(req, res, next) {
  //variables de usuario
  
  const ID_user = req.query.id;
  const requi = req.query.requi;
  console.log("id:"+ID_user+"  req:"+requi)
  if(ID_user== (undefined||"")||requi==(undefined||""))
  {
    errores(res, err400)
  }
  else{
   try{
     //titulo en pestaña envío de variables para url
     res.render('index', { title: 'Consejos', idHTML: ID_user, requiHTML:requi, host:host });
   }
   catch(err){
    errores(res, err500)
    console.log(err)
   }
  }
 
});
  
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
      console.log('guardado exitoso: '+estado);
    }
    catch(err){
      console.log(err);
    }
  }
  guardarEntrevista();


});
router.get('/empezar', function(req, res, next) {
  const ID_userEmp = req.query.id;
  const requiEmp = req.query.requi;
  if(ID_userEmp== (undefined||"")||requiEmp==(undefined||""))
  {
    errores(res, err400)
  }
  else{
    try{
      function loadPage(list){
        if(list.includes('err')){
          //no hay registro o está erronea la requi
          errores(res, err400);
        }
        else{
          list=list.replace(/'/g, '"');
          list=JSON.parse(list)
          res.render('empezar', {
            title: 'Entrevistas HQ5',
            bttn:"Probar sonido",
            alerta:"Espera un momento mientras cargan la configuraciones de cámara",
            txt_content:"Recuerda que la entrevista es una herramienta que nos permite conocerte mejor, así que ponte cómodo y ayudanos respondiendo las preguntas que se te harán a continuación :)",
            idUser: ID_userEmp,
            requiUser: requiEmp,
            preguntasList:list
          });  
        }
      }
      python_getInfo({"key":"contenido", "requi": requiEmp }, loadPage);
    }
    catch(err){
      errores(res, err500);
      console.log(err);
    }
    
}
}); 

router.get('/contacto', function(req, res, next) {
  try{
    res.render('contacto', { title: 'Contacto HQ5' });
  }
  catch(err){
    errores(res, err500);
      console.log(err);
  }
});
module.exports = router;

//------------------------------
//see video-----------------------------
//-----------------------------------------------
router.get('/vd6839h5kl', function(req, res, next) {
  //variables de usuario
  ID_userS = req.query.id;
  if (ID_userS==(""||undefined)){
    errores(res, err400);
  }
  else{
    try{
      let sqlVideo= "SELECT `entrevistaBase64` FROM defaultdb.entrevistas WHERE `aplicar_convocatorias_id` = "+ ID_userS+";"
      con.query(sqlVideo, function (err, result) {
        if (err){
          errores(res, err400);
        }
        else{ 
          try{
        var base64video = result[0]["entrevistaBase64"];
      res.render('verVideo', { title: 'Video entrevistas HQ5',base64: base64video, idUser:ID_userS });

      }catch(err){
        errores(res, err400);
        console.log(err);
      }
        }
      });
    }
    catch(err){
      errores(res, err500);
      console.log(err)
    }
  }
});

router.get('/*', function(req, res, next) {
  res.render('404err',  {title: 'error 404'})
})

