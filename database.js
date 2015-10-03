var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var Q = require('q');

// Setup MongoClient
var url = 'mongodb://localhost:27017/ac_cards';

var db = Q.defer();
MongoClient.connect(url, function(err, _db){
  if(err)
    logger.log('error', err);

  db.resolve(_db);
});

module.exports = db.promise;
