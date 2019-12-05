var express = require('express');
var router = express.Router();
const home = require('./home');
const isUser = require('./users');
const addrSearch = require('./addrSearch');

/* GET landing page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'User Login' });
});


router.post('/submit', function(req, res, next) {
  const username = req.body.username; 
  var address = req.body.address;
  const query = address.split(' ').join('+');
  if(isUser(username)) 
    res.render('home', { user: username, address: address, query: query });
  else
    return next();
}, function(req, res, next, username) { // new user must enter home address
  var address = req.body.address;
  var query = address.split(' ').join('+');
  res.render('home', { user: username, address: address, home: query }); // pass new user and address query
});

module.exports = router;
