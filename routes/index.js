var express = require('express');
var router = express.Router();

const app=express();

app.use(express.static("public"));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/empezar', function(req, res, next) {
  res.render('empezar', { title: 'Entrevistas HQ5',bttn:"Listo",alerta:"espere un momento por favor",txt_content:"A continación se realizará la entrevista vitual. Cuando des click en el botón 'Listo' se comenzará a grabar el video que se toma desde tu dispositivo.La entrvista tiene un tiempo límite de máximo 6 minutos. Recuerda que la entrevista es una herramienta que nos permite conocerte mejor, así que ponte cómodo y ayudanos respondiendo la preguntas que se te harán a continuación :)" });
});

router.get('/contacto', function(req, res, next) {
  res.render('contacto', { title: 'Contacto HQ5' });
});
module.exports = router;
