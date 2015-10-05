var express = require('express');
var winston = require('winston');
var logger = require('../logger.js');
var router = express.Router();

router.use(function(req, res, next){
  logger.log('info', {
    url: req.originalUrl,
    method: req.method,
    host: req.headers.host
  });

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods","POST, GET, OPTIONS, PUT");

  next();
});

var cards = require('./cards/cards.js');
var users = require('./users/users.js');

router.use('/cards', cards);
router.use('/users', users);

module.exports = router;
