var express = require('express');
var router = express.Router();
var user = require('./index');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'User Map', username: req.body.username, home: req.body.address });
  console.log(req.body.username, req.body.address);
});

module.exports = router;
