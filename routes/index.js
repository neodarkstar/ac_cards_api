var express = require('express');
var winston = require('winston');
var logger = require('../logger.js');
var router = express.Router();
var jwt = require('jsonwebtoken');

var login = require('./login');
var cards = require('./cards');
var users = require('./users');
var trades = require('./trades');

// Set CORS HEADERS
router.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods","POST, GET, OPTIONS, PUT");

  next();
})

router.use('/login', login);

// AUTH INFO
router.use(function(req, res, next){
  var requestInfo = {
    url: req.originalUrl,
    method: req.method,
    host: req.headers.host
  };

  if(req.method === 'OPTIONS'){
    res.sendStatus(200);
  } else {
    var token = req.headers.authorization;
    jwt.verify(token, process.env.JWT_APIKEY, function(err, decoded){
      if(err){
        requestInfo['error'] = err;
        logger.log('error', requestInfo);
        res.sendStatus(401);
      } else {
        requestInfo['username'] = decoded.username;
        logger.log('info',requestInfo);
        req.profileInfo = { id: decoded.userId };
        next();
      }
    });
  }
});

router.use('/cards', cards);
router.use('/users', users);
router.use('/trades', trades);

module.exports = router;
