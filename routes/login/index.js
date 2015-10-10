var express = require('express');
var router = express.Router();
var logger = require('../../logger.js');
var db = require('../../database.js');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var process = require('process');

router
  .post('/', function(req, res){
    var username = req.body.username;
    var password = req.body.password;

    db.then(function(_db){
      var collection = _db.collection('users');
      var cursor = collection.find({ email:username }).limit(1).project({email:1, password:1, _id:0});

      cursor.toArray(function(err, docs){
        var hash = docs[0].password;

        bcrypt.compare(password, hash, function(err, result){
          if(err){
            logger.log('error', err);
            res.sendStatus(500);
          }
          if(result)
            res.json(generateToken({ username: username }));
          else {
            res.sendStatus(401);
          }

        });

      });

    })

  })
  .get('/validate', function(req, res){
    var token = req.headers.authorization;
    jwt.verify(token, process.env.JWT_APIKEY, function(err, decoded){
      if(err){
        requestInfo['error'] = err;
        logger.log('error', requestInfo);
        res.sendStatus(401);
      } else {
        res.sendStatus(200);
      }
    });
  });

function generateToken(obj){
  var options = {
    expiresIn: '30m',
    algorithm: 'HS256'
  }
  return jwt.sign(obj, process.env.JWT_APIKEY, options);
}

module.exports = router;
