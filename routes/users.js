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
      var users = _db.collection.find({ id: req.params.id }).toArray();

      


    })

  })
  .post('/', function(req, res){




  })
  .put(':id', function(req, res){




  })

  module.exports = router;
