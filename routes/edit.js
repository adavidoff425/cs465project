var express = require('express');
var router = express.Router();

/* GET landing page. */
router.get('/', function(req, res, next) {
  res.render('edit', { title: 'Calendar Edit' });
});

module.exports = router;
