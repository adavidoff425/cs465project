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
  const address = req.body.address;
  if(isUser(username)) 
    res.render('home', { user: username, address: address });
  else
    return next();
}, function(req, res, next, username) { // new user must enter home address
  var address = req.body.address;
  var query = address.split(' ').join('+');
  //var result = addrSearch(query); // implemented in addrSearch.js
  //console.log(result);
    res.render('home', { user: username, home: query }); // pass new user and address query
});

module.exports = router;
