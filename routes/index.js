var express = require('express');
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');



var router = express.Router();

const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static("public"));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//--video
router.post('/video', function(req, res) {
  var urlVideo=req.body.url_video;
  const url_=urlVideo.replace('blob:','');
  // URL of the image

  https.get(url_,(res) => {
    // Image will be stored at this path
    const path = 'C:/Users/jnat_/Desktop/video.mp4'; 
    const filePath = fs.createWriteStream(path);
    res.pipe(filePath);
    filePath.on('finish',() => {
        filePath.close();
        console.log('Download Completed'); 
    })
})
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

