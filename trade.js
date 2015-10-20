var db = require('./database.js');
var _ = require('lodash');
var Q = require('q');
var Trade = {

  getTrades: function(userId){
    var trades = [];
    var promise = Q.defer();

    db.then(function(_db){
      _db.collection('users').find({ id: userId }).project({ _id:0, cards: 1}).limit(1).toArray(function(err, user){
        _db.collection('users').find({ id: { $ne: userId }}).project({ _id:0, id: 1, email: 1, cards: 1, name: 1}).toArray(function(err, oUsers){

          var userCards = user[0].cards;
          _.forEach(oUsers, function(oUser, index){
            var matches = match(userCards, oUser.cards);

            trades.push({
              user: { id: oUser.id, name: oUser.name },
              trades: matches.cards,
              possibleTrades: matches.possibleTrades
            });
          });

          promise.resolve(trades);

        });
      });
    });

    return promise.promise;
  }
}

function match(myCards, oCards){
  var cards = [];
  var needs = 0;
  var wanted= 0;

  _.forEach(myCards, function(card, index){
    var trade = {
      number: card.number,
      need: false,
      wanted: false
    }

    if(card.qty == 0 && oCards[index].qty > 1){
      trade.need = true
      needs++;
      cards.push(trade)
    } else if(card.qty > 1 && oCards[index].qty == 0){
      trade.wanted = true
      wanted++;
      cards.push(trade);
    }
  });

  var possibleTrades = 0;

  if(needs <= wanted){
    possibleTrades = needs;
  } else if(wanted < needs){
    possibleTrades = wanted;
  }

  return { cards: cards, possibleTrades: possibleTrades };
}

module.exports = Trade;
