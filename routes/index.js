var express = require('express');
var router = express.Router();
var username = "";

/* GET landing page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'User Login' });
});


module.exports = router;
exports.username = username;
