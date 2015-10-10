var express = require('express');
var winston = require('winston');
var logger = require('../logger.js');
var router = express.Router();
var jwt = require('jsonwebtoken');

var login = require('./login');
var cards = require('./cards');
var users = require('./users');

router.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods","POST, GET, OPTIONS, PUT");
  next();
})

router.use('/login', login);

router.use(function(req, res, next){

  var requestInfo = {
    url: req.originalUrl,
    method: req.method,
    host: req.headers.host
  };

  var token = req.headers.authorization;
  jwt.verify(token, process.env.JWT_APIKEY, function(err, decoded){
    if(err){
      requestInfo['error'] = err;
      logger.log('error', requestInfo);
      res.sendStatus(401);
    } else {
      requestInfo['username'] = decoded.username;
      logger.log('info',requestInfo);
      res.username = decoded.username;
      next();
    }
  });

});

router.use('/cards', cards);
router.use('/users', users);

module.exports = router;
