var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/js')); // Laad de files in public on de server webpage
app.use(bodyParser.json());

app.get('/contactlist', function (req, res) {
  console.log('I received a GET request');

  person1 = {
    name: 'someone1',
    email: 'someone1@hey.me',
    number: '04xx xxx xx1'
  };
  
  person2 = {
    name: 'someone2',
    email: 'someone2@hey.me',
    number: '04xx xxx xx2'
  };
  
  person3 = {
    name: 'someone3',
    email: 'someone3@hey.me',
    number: '04xx xxx xx3'
  };
  

  var contactlist = [person1, person2, person3];
  res.json(contactlist);
});

app.listen(3000);
console.log("Server running on port 3000");