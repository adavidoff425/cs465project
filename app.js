'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');

var async = require('asyncawait/async');
var await = require('asyncawait/await');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
	
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + "/index.html")
	)
});
app.listen(8080);
