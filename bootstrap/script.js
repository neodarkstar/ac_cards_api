var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/ac_cards';
var fs = require('fs');
var csv = require('fast-csv');
var Q = require('q');
var _ = require('lodash');

var conn = Q.defer();

MongoClient.connect(url, function(err, _db){
  if(err)
    console.log(err);

    conn.resolve(_db);
});

loadCards(conn.promise).then(
  function(cards){
    loadUsers(conn.promise, cards).then(function(db, users){
      conn.close();
    });
  });

function loadCards(db){
  var stream = fs.createReadStream("series_1.csv");
  var cards = [];

  var done = Q.defer();

  csv
    .fromStream(stream, { headers:true })
    .transform(function(data){
      return _.merge(data, { qty: 0 });
    })
    .on('data', function(data){
      cards.push(data);
    })
    .on('end', function(){
      db.then(function(_db){
        var collection = _db.collection('cards');
          collection.drop();

          collection.insertMany(cards, function(err, result){
            if(err)
              console.log(err);

      			console.log("Inserted " + result.result.n + ' documents');
            done.resolve(cards);
      	});
      });
    });

    return done.promise;
}

function loadUsers(db, cards){
  var userStream = fs.createReadStream("users.csv");
  var users = [];
  var done = Q.defer();

  csv
    .fromStream(userStream, { headers: true })
    .transform(function(data){
      return {
        id: parseInt(data.id),
        name: data.name,
        city: data.city,
        state: data.state,
        email: data.email,
        password: data.password,
        cards: cards
      }
    })
    .on('data', function(data){
      users.push(data);
    })
    .on('end', function(){
      db.then(function(_db){
        var collection = _db.collection('users');
        collection.drop();

        collection.insertMany(users, function(err, result){
          if(err)
            console.log(err);

          console.log("Inserted " + result.result.n + ' documents');
          done.resolve(users);
        });
      })
    });

    return done.promise;
}
