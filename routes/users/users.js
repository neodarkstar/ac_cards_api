var express = require('express');
var router = express.Router();
var logger = require('../../logger.js');
var db = require('../../database.js');
var _ = require('lodash');


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


    });
  });

  module.exports = router;
