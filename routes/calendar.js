var express = require('express');
var router = express.Router();
var isUser = require('./users');

/* GET landing page. */
router.get('/', function(req, res, next) {
  if(req.app.locals.user != null) {
    const user = isUser(req.app.locals.user);
    res.render("calendar", { title: user.name + ' Calendar' , user: req.app.locals.user, address: user.home.address, lnglat: user.home.coordinates });
  }
});

router.get("/home", function(req, res) {
    if(req.app.locals.user != null) {
      const user = isUser(req.app.locals.user);
      res.render("home", { title: user.name + ' Map', user: req.app.locals.user, address: user.home.address, lnglat: user.home.coordinates });
    } else {
      req.app.locals.user = null;
      res.render("index", { title: 'Sign in to view calendar' });
    }
});

module.exports = router;
