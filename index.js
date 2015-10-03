var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var winston = require('winston');
var mongodb = require('mongodb');
var Q = require('q');
var MongoClient = require('mongodb').MongoClient;


// Setup logger
var logger = new(winston.Logger)({
  transports: [
      new(winston.transports.File)({
        name: 'info-file',
        filename: 'logs/filelog-info.log',
        level: 'info'
      }),
      new(winston.transports.File)({
        name: 'error-file',
        filename: 'logs/filelog-error.log',
        level: 'error'
      })
  ]
});

// Setup MongoClient
var url = 'mongodb://localhost:27017/ac_cards';
var db = Q.defer();
MongoClient.connect(url, function(err, _db){
  if(err)
    logger.log('error', err);

  db.resolve(_db);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 8080;

var router = express.Router();

router.use(function(req, res, next){
  logger.log('info', {
    url: req.originalUrl,
    method: req.method,
    host: req.headers.host
  });

  next();
});

router.get('/cards', function(req, res) {
  db.promise
    .then(function(_db){
      var collection = _db.collection('cards');
      var cursor = collection.find();

      cursor.toArray(function(err, documents){
        if(err)
          logger.log('error', err);

        res.json(documents);
      });

    })
  })
  .get('/cards/:id', function(req, res){
    db.promise
      .then(function(_db){
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
  .post('/cards', function(req, res){
    db.promise
      .then(function(_db){
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

app.use('/api', router);

app.listen(port);
