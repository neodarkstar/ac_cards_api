var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Q = require('q');
var routes = require('./routes');
var logger = require('./logger.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 8080;

app.use('/api', routes);

app.listen(port);
