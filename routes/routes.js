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

var cards = require('./cards/cards.js');
var users = require('./users/users.js');

router.use('/cards', cards);
router.use('/users', users);

module.exports = router;
