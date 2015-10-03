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

  next();
});

var cards = require('./cards.js');

router.use('/cards', cards);

module.exports = router;
