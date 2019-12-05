/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var fetch = require('node-fetch');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res) {
      var ip = req.ip;
      // console.log(req.query.stock, typeof req.query.stock);
      var stocks = [];
      if (typeof req.query.stock === 'string') stocks.push(req.query.stock);
      else stocks = [...req.query.stock];
      // console.log(stocks, typeof stocks);
      var stockUrls = stocks.map(stock => `https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`);
      // console.log(stockUrls);

      var stockData = [];
      Promise.all(stocks.map(stock => fetch(`https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`)))
        .then(data => Promise.all(data.map(datum => datum.json())))
        .then(stockData => {
          var result = stockData.map(stock => {
            return { "stock": stock.symbol, "price": `${stock.latestPrice}`, "likes": "TwoDo" }
          });
          res.json({ "stockData": result.length < 2 ? result[0] : result });
        });
    });
};