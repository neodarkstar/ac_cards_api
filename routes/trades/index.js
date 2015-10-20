var express = require('express');
var router = express.Router();
var logger = require('../../logger.js');
var db = require('../../database.js');
var Trade = require('../../trade.js');

router
  .get('/:id', function(req, res){
    var userId = req.profileInfo.id;

    Trade.getTrades(userId).then(function(trades){
      res.json(trades);
    });

  });

module.exports = router;
