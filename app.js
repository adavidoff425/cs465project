'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var indexRouter = require('./routes/index');
var landingRouter = require('./routes/landing');
var editRouter = require('./routes/edit');
//var async = require('asyncawait/async');
//var await = require('asyncawait/await');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use('/', landingRouter);
app.use('/index', indexRouter);
app.use('./index/edit', editRouter);

app.listen(8080);
