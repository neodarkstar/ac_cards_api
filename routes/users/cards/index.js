var express = require('express');
var router = express.Router({ mergeParams: true});
var logger = require('../../../logger.js');
var db = require('../../../database.js');
var _ = require('lodash');

router.all('*', function(req, res, next){
  if(req.params.id == req.profileInfo.id){
    next();
  } else {
    res.sendStatus(401);
  }
});

router
  .get('/', function(req, res){
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
  .get('/:cardId', function(req, res){
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
  .put('/:cardId', function(req, res){
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
