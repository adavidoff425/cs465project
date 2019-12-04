var express = require('express');
var router = express.Router();
var user = require('./landing.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'User Map' });
})



module.exports = router;
