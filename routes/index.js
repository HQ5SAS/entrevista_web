var express = require('express');
const fs = require('fs');
const https = require('https');
/* 
// URL of the image
const url = videoUrl;
  
https.get(url,(res) => {
    // Image will be stored at this path
    const path = `${__dirname}/images/img.mp3`; 
    const filePath = fs.createWriteStream(path);
    res.pipe(filePath);
    filePath.on('finish',() => {
        filePath.close();
        console.log('Download Completed'); 
    })
})*/

var router = express.Router();

const app=express();

app.use(express.static("public"));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/empezar', function(req, res, next) {
  res.render('empezar', { title: 'Entrevistas HQ5',bttn:"Probar sonido",alerta:"espere un momento por favor",txt_content:"Recuerda que la entrevista es una herramienta que nos permite conocerte mejor, así que ponte cómodo y ayudanos respondiendo la preguntas que se te harán a continuación :)" });
});

router.get('/contacto', function(req, res, next) {
  res.render('contacto', { title: 'Contacto HQ5' });
});
module.exports = router;
