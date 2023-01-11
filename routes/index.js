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
  //subproceso python 
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
//------
router.get('/', function(req, res, next) {
  //titulo en pestaña 
  res.render('index', { title: 'Consejos' });
  //variables de usuario
  var ID_user = req.query.id;
  var requi = req.query.requi;

  console.log('requi:'+ requi+'id:'+ID_user);
});
//---busqueda registro para función sen info (cambia registro de zoho)
router.get("/zohoConexion", function(req, res){
  console.log("solicitud enviada a python");
  script_python({"key":"contenido", "id": ID_user});
  res.send("solicitud recibida");
});
//---finalizar entrevista
//--video
router.post('/video', function(req, res) {
  var urlVideo=req.body.url_video;
  var respuestas =req.body.transcripcion;
  var duracion=req.body.tiempo;
  const url_=urlVideo.replace('blob:','');
  // URL of the video
  var fecha=new Date();
    var dia = fecha.getDate();
    var mes =fecha.getMonth();
    var anio=fecha.getFullYear();
    var hora= addZero(fecha.getHours());
    var minutos=addZero(fecha.getMinutes());
    var segundos=addZero(fecha.getSeconds());

    var fechaFinEntrevista= `${dia}/${mes}/${anio}T${hora}:${minutos}:${segundos}`;
    console.log(fechaFinEntrevista);
    var sql = "INSERT INTO `defaultdb`.`entrevistas` (`respuestas`, `duracion_entrevista`, `fecha_entrevista`, `aplicar_convocatorias_id`) VALUES ('"+respuestas + "', '"+ duracion+ "', '"+fechaFinEntrevista + "', '"+ ID_user+ "');";
    con.query(sql, function (err, result) {
    if (err) throw err; 
       
    console.log("succesfull"+sql);
});
  https.get(url_,function(res){
    // Video will be stored at this path
   /* const path = 'C:/Users/jnat_/Desktop/video.mp4'; 
    res.pipe(path);
    const filePath = fs.createWriteStream(path);
    res.pipe(filePath);
    filePath.on('finish',function() {
        filePath.close();
        console.log('Download Completed'); 
    })*/

    //------enviar informacoón a SQL
    
})
/*const req = https.get(url_,function(res){
  const filestream=fs.creatcwritestrem("photo.jpeg");
  res.pipe(filestream);

  filestream.on("error",function(){
    filestream.close();
    console.log("done");
  })
})
//--
  console.log(url_);
  res.send({urlVideo});*/
  
});



router.get('/empezar', function(req, res, next) {
  res.render('empezar', { title: 'Entrevistas HQ5',bttn:"Probar sonido",alerta:"espere un momento por favor",txt_content:"Recuerda que la entrevista es una herramienta que nos permite conocerte mejor, así que ponte cómodo y ayudanos respondiendo la preguntas que se te harán a continuación :)" });
});

router.get('/contacto', function(req, res, next) {
  res.render('contacto', { title: 'Contacto HQ5' });
});
module.exports = router;

