var express = require('express');
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const { con } = require("./db")
//const cors = require('cors');
const router = express.Router();
const app=express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static("public"));

const host = 'http://localhost:3000';



//-
const { spawn } = require("child_process");
//-- funciones 
function script_python(content){
  //Creo subproceso python 
   pythonProcess = spawn("python", ["./libs_python/zohoAPIpy.py"]);
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
router.get("/zohoConexion", function(req, res){
  console.log("solicitud enviada a python");
  script_python({"key":"contenido"});
  res.send("solicitud recibida");
});

//--+
router.get('/', function(req, res, next) {
  //titulo en pestaña 
  res.render('index', { title: 'Consejos' });
  //variables de usuario
  var ID_user = req.query.id;
  var requi = req.query.requi;

  console.log('requi:'+ requi+'id:'+ID_user);
});

 //

//---

/*const whiteList =[host,'https://accounts.zoho.com/oauth/v2/token?client_id=1000.BXCXYLGQX0TPGT0B4KPR5NKV2RXK2U&grant_type=refresh_token&client_secret=10e319c31847a45291d7b79b5344ea3b8329738a17&refresh_token=1000.6ae69ca138d2f6c5adba08e52b52b4f6.4d09d4c6009923c6d7d36e535f9f37b7']
app.use(cors({origin:whiteList}));*/


/* GET home page.
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
}); */
//--video
router.post('/video', function(req, res) {
  var urlVideo=req.body.url_video;
  const url_=urlVideo.replace('blob:','');
  // URL of the image
/*
  https.get(url_,function(res){
    // Image will be stored at this path
    const path = 'C:/Users/jnat_/Desktop/video.mp4'; 
    res.pipe(path);
    const filePath = fs.createWriteStream(path);
    res.pipe(filePath);
    filePath.on('finish',function() {
        filePath.close();
        console.log('Download Completed'); 
    })
})
const req = https.get(url_,function(res){
  const filestream=fs.creatcwritestrem("photo.jpeg");
  res.pipe(filestream);

  filestream.on("error",function(){
    filestream.close();
    console.log("done");
  })
})*/
//--
  console.log(url_);
  res.send({urlVideo});
  
});



router.get('/empezar', function(req, res, next) {
  res.render('empezar', { title: 'Entrevistas HQ5',bttn:"Probar sonido",alerta:"espere un momento por favor",txt_content:"Recuerda que la entrevista es una herramienta que nos permite conocerte mejor, así que ponte cómodo y ayudanos respondiendo la preguntas que se te harán a continuación :)" });
});

router.get('/contacto', function(req, res, next) {
  res.render('contacto', { title: 'Contacto HQ5' });
});
module.exports = router;

