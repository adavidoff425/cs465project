var express = require('express');
var router = express.Router();

/* GET landing page. */
router.get('/', function(req, res, next) {
  res.render('calendar', { title: 'Calendar View Page' });
});

module.exports = router;
