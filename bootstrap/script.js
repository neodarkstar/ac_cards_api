var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/ac_cards';
var fs = require('fs');
var csv = require('fast-csv');

var stream = fs.createReadStream("series_1.csv");

var cards = [];

csv
  .fromStream(stream, { headers:true })
  .on('data', function(data){
    cards.push(data);
  })
  .on('end', function(){
    MongoClient.connect(url, function(err, db){
    	var cardsCol = db.collection('cards');
        cardsCol.drop();

    		cardsCol.insertMany(cards, function(err, result){
    			console.log("Inserted " + result.result.n + ' documents');
    	});
    });
  });
