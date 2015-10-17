var express = require('express');
var router = express.Router();
var logger = require('../../logger.js');
var db = require('../../database.js');
var _ = require('lodash');
var bcrypt = require('bcrypt');
var cardRouter = require('./cards');

router.use('/:id/cards', cardRouter);

// Allow only the user to access their own stuff
router.all('/:id', function(req, res, next){
  if(parseInt(req.params.id) === req.profileInfo.id){
    next();
  } else {
    res.sendStatus(401);
  }
});

router
  .get('/', function(req, res){
    if(req.isAdmin === true){
      db.then(function(_db){
        var collection = _db.collection('users');
        var cursor = collection.find().project({ _id: 0, id: 1, name: 1, city: 1, state: 1, email: 1 });

        cursor.toArray(function(err, documents){
          if(err)
            logger.log('error', err);

          res.json(documents);
        });

      });
    } else {
      res.sendStatus(401);
    }

  })
  .post('/', function(req, res){
    db.then(function(_db){
      // Set user info
      var user = {
        id: 2,
        name: req.body.name,
        city: req.body.city,
        state: req.body.state,
        email: req.body.email
      }
      bcrypt.genSalt(function(err, salt){
        if(err){
          logger.log('error', err);
          res.sendStatus(500)
        } else {
          bcrypt.hash(req.body.password, salt, function(err, hash){
            if(err){
              logger.log('error', err);
              res.sendStatus(500)
            } else {
              // Set the crypted password
              user.password = hash;
              // Insert all the cards into the new user
              var cards = _db.collection('cards').find();
              cards.toArray(function(error, cardList){
                user.cards = cardList || [];
                var users = _db.collection('users');
                users.insert(user, function(err, doc){
                  if(err){
                    res.status(400).send('Error inserting record');
                  } else {
                    res.sendStatus(201);
                  }
                });
              });
            }
          });
        }
      });
    })
  })
  .get('/:id', function(req, res){
    db.then(function(_db){
      var cursor = _db.collection('users').find({ id: parseInt(req.params.id) }).project({ _id: 0, id: 1, name: 1, city: 1, state: 1, email: 1 });

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
  });

  module.exports = router;
