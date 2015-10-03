
var express = require('express');
var router = express.Router();
var logger = require('../logger.js');
var db = require('../database.js');

router
  .get('/', function(req, res) {
    db.then(function(_db){
      var collection = _db.collection('cards');
      var cursor = collection.find();

      cursor.toArray(function(err, documents){
        if(err)
          logger.log('error', err);

        res.json(documents);
      });

    })
  })
  .get('/:id', function(req, res){
    db.then(function(_db){
        var collection = _db.collection('cards');
        var cursor = collection.find({ number: req.params.id });

        cursor.count(function(err,count){
          if(err){
            logger.log('error', err);
          }

          if(count == 0)
            res.status(404).send();
          else {
            cursor.toArray(function(err, documents){
              if(err){
                logger.log('error', err);
              }
              res.json(documents[0]);
            });
          }
        })
      })
  })
  .post('/', function(req, res){
    db.then(function(_db){
        var collection = _db.collection('cards');

        var card = {
          number: req.body.number,
          name: req.body.name,
          type: req.body.type,
          birthday: req.body.birthday,
          sign: req.body.sign,
          dice: req.body.dice,
          rps: req.body.rps
        }

        collection.insert(card)
          .then(function(err, result){
            if(err)
              logger.log('error', err);

            logger.log('info', result);

            res.status(201).send();
          })
      });
    });

module.exports = router;
