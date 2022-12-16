/*server.js*/

let express = require('express')
const Requetes = require('./middlewares/requetes')
let app = express()

app.set('view engine', 'ejs')

// Middleware
app.use('/assets', express.static('public'))
//app.use(require('./middlewares/requetes'))

// Routes
app.get('/', (request, response) => {
  if (request.query.mot_cle) {
    response.render('pages/index', {mot_cle: request.query.mot_cle})
    /*Requetes.rechercherNom(request.query.mot_cle, function() {

    })*/
  }
  else {
    response.render('pages/index')
  }
})

app.get('/domain', (request, response) => {
  response.redirect('/');
})

app.get('/scientist', (request, response) => {
  response.redirect('/');
})

app.get('/domain/:domain_name', (request, response) => {
  response.render('pages/domain', {domain_name: request.params.domain_name})
  /*Requetes.rechercherNom(request.query.mot_cle, function() {

  })*/
})

app.get('/scientist/:scientist_name', (request, response) => {
  response.render('pages/scientist', {scientist_name: request.params.scientist_name})
  /*Requetes.rechercherNom(request.query.mot_cle, function() {

  })*/
})

app.get('/concept/:concept_name', (request, response) => {
  response.render('pages/concept', {concept_name: request.params.concept_name})
  /*Requetes.rechercherNom(request.query.mot_cle, function() {

  })*/
})

app.get('/random', (request, response) => {
  Requetes.random(function(nom_aleatoire) {
    response.redirect('/scientist/'+nom_aleatoire)
  })
})

app.listen(80)

/*
const http = require('http');
const url = require('url');
const fs = require('fs');
const mimeTypes = {
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "png": "image/png",
  "ico": "image/ico",
  "svg": "image/svg+xml",
  "json": "application/json",
  "js": "text/javascript",
  "css": "text/css"
};

const hostname = '127.0.0.1';

const port = 80;

const pathIndex = "./index.html";

const server = http.createServer(function(req, res) {

    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;
    if (filename == "./") filename = pathIndex;
    fs.readFile(filename, function(err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end("404 Not Found");
      } 
      console.log("Ressource demandée = " + req.url + " type mime associé = " + mimeTypes[filename.split('.').pop()]);
      res.writeHead(200, {'Content-Type': mimeTypes[filename.split('.').pop()]});
      res.write(data);
      return res.end();
    });

});

server.listen(port, hostname, function() {

  console.log('Server running at http://'+ hostname + ':' + port + '/');

});
*/