var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('studenteninfo', ['studenteninfo']);
var bodyParser = require('body-parser');
var AuthToken = "?client_id=7e32dd77e238e8d45a05&client_secret=8fa4c0406a050476dbdfdce9bac0dec98130abcb";
var ClientId = "?client_id=7e32dd77e238e8d45a05";
const https = require('https');
var fullUserCode;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.post('/TokenExchange', function (req, res) {
  var URL = req.headers.referer;
  var code = URL.substring(28, URL.indexOf('=') + 21);

  https.get('https://github.com/login/oauth/access_token' + AuthToken + '&code=' + code, (resGithub) => {

    resGithub.on('data', (d) => {
      var fullUserCode = process.stdout.write(d);
      console.log(d.toString());
      res.json({token: d.toString()});
    });

    }).on('error', (e) => {
      console.error(e);
  });
});

app.get('/studenteninfo', function (req, res) {
  console.log('I received a GET request');
  db.studenteninfo.find(function (err, docs) {
    console.log(docs);
    res.json(docs);
  });
});

app.post('/studenteninfo', function (req, res) {
  console.log(req.body);
  db.studenteninfo.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/studenteninfo/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  db.studenteninfo.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});

app.get('/studenteninfo/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  db.studenteninfo.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
  
});

app.put('/studenteninfo/:id', function (req, res) {
  var id = req.params.id;
  console.log(req.body.name);
  db.studenteninfo.findAndModify({
    query: {_id: mongojs.ObjectId(id)},
    update: {$set: {name: req.body.name, label: req.body.label, data: req.body.data}},
    new: true}, function (err, doc) {
      res.json(doc);
    }
  );
});

app.listen(3000);
console.log("Server running on port 3000");