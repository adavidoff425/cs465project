'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var landing = require('./routes/index');
var home = require('./routes/home');
//var editRouter = require('./routes/edit');
//var async = require('asyncawait/async');
//var await = require('asyncawait/await');

var apiKey = process.env.APIKEY;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'pug');

app.use('/', landing);
app.use('/home', home);

app.get('/', function(req, res, next) {
  res.render('index');  // implement view
});

app.get('/calendar', function (req, res) {
  res.render('calendar');
});

app.get('/home', function (req, res) {
  res.render('home');
});

/*app.post('/submit', function(req, res, next) {
  var username = req.body.username; 
// if(username == alreadyUser) // implement
    res.render('home', { user: username });
 // else
    res.render('index', { mode: 1 }); 
}); // moved to index.js route */



/*
app.post('/home', function(req, res, next) { // new user must enter home address
  var address = req.body.address;
  var query = address.split(' ').join('+');
  var home = map.addrSearch(query); // implement
  console.log(home);
  if(home)
    res.render('home', { user: username, home: home }); // pass new user and address query
  else {
    window.alert('Address not found. Please try again.');
    res.render('index', { mode: 1 });
  }
});*/

app.listen(8080);

module.exports = app;
