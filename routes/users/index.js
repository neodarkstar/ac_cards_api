var express = require('express');
var router = express.Router();
var logger = require('../../logger.js');
var db = require('../../database.js');
var _ = require('lodash');
var bcrypt = require('bcrypt');


router
  .get('/', function(req, res){

    db.then(function(_db){
      var collection = _db.collection('users');
      var cursor = collection.find();

      cursor.toArray(function(err, documents){
        if(err)
          logger.log('error', err);

        res.json(documents);
      });

    });

  })
  .get('/:id', function(req, res){
    db.then(function(_db){
      var cursor = _db.collection('users').find({ id: parseInt(req.params.id) });

      cursor.count(function(err,count){
        if(err)
          logger.log('error', err);

        if(count == 0)
          res.sendStatus(404);

        cursor.toArray(function(err, documents){
          if(err)
            logger.log('error', err);

          res.json(documents[0]);
        })
      });
    })
  })
  .put('/:id', function(req, res){
      db.then(function(_db){
        var collection = _db.collection('users');
        var username = req.body.username;
        var password = req.body.password;

        bcrypt.genSalt(function(err, salt){
          if(err){
            logger.log('error', err);
            res.sendStatus(500);
          }
          bcrypt.hash(password, salt, function(err, hash){
            if(err){
              logger.log('error', err);
              res.sendStatus(500);
            }
            collection.findOneAndUpdate(
              { id: parseInt(req.params.id) },
              { $set: { email: username, password: hash }},
              function(err, result){
                if(err){
                  logger.log('error', err);
                  res.sendStatus(500);
                }

                res.json(result);
              });
          });
        });

      })
  })
  .get('/:id/cards', function(req, res){
    db.then(function(_db){
      var cursor = _db.collection('users').find({ id: parseInt(req.params.id) });

      cursor.count(function(err,count){
        if(err)
          logger.log('error', err);

        if(count == 0)
          res.sendStatus(404);

        cursor.toArray(function(err, documents){
          if(err)
            logger.log('error', err);

          res.json(documents[0].cards);
        })
      });
    })
  })
  .get('/:id/cards/:cardId', function(req, res){
    db.then(function(_db){
      var cursor = _db.collection('users').find({ id: parseInt(req.params.id) });

      cursor.count(function(err,count){
        if(err){
          logger.log('error', err);
          res.sendStatus(400);
        }
        if(count == 0)
          res.sendStatus(404);

        cursor.toArray(function(err, documents){
          if(err)
            logger.log('error', err);

          var card = _.find(documents[0].cards, { number: req.params.cardId });

          res.json(card);
        })
      });
    })

  })
  .put('/:id/cards/:cardId', function(req, res){
    db.then(function(_db){
      var collection = _db.collection('users');
      var cursor = collection.find({ id: parseInt(req.params.id) });
      var qty = parseInt(req.body.qty);

      if(qty < 0){
        res.status(400).send('Qty must be positive');
      } else {
        cursor.count(function(err, count){
          if(err)
            console.log('error', err);

          if(count == 0)
            res.sendStatus(404);
          else {
            cursor.toArray(function(err, documents){
              var document = documents[0];

              var index =_.findIndex(document.cards, { number: req.params.cardId });

              document.cards[index].qty = parseInt(parseInt(req.body.qty));

              collection.update({ id: parseInt(req.params.id)}, document);

              res.json(document);

            });
          }
        })
      }
    });
  });

  module.exports = router;
