var express = require('express');
var router = express.Router();
var logger = require('../logger.js');
var db = require('../database.js');


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
  });

  module.exports = router;
