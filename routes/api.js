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

const MONGODB_CONNECTION_STRING = process.env.DB;

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res) {
      var ip = req.ip;
      // console.log(req.query.stock, typeof req.query.stock);
      var stocks = [];
      if (Array.isArray(req.query.stock)) stocks = req.query.stock;
      else stocks.push(req.query.stock);
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useUnifiedTopology: true }, function (err, db) {
        if (err) return console.error(err);
        var stock_db = db.db('test').collection('stock_db');

        stock_db.find({ symbol: { $in: stocks } }).toArray(function (err, stockList) {
          if (err) return console.error(err);
          
          console.log(stockList);

          Promise.all(stocks.map(stock => fetch(`https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`)))
            .then(data => Promise.all(data.map(data => data.json())))
            .then(stockData => {
              var result = stockData.map(stock => {
                return stockData.length === 1 ?
                  {
                    "stock": stock.symbol,
                    "price": `${stock.latestPrice}`,
                    "likes": "TwoDo"
                  } :
                  {
                    "stock": stock.symbol,
                    "price": `${stock.latestPrice}`,
                    "rel_likes": "TwoDo"
                  };
              });
              res.json({ "stockData": result.length < 2 ? result[0] : result });
            });
          db.close();
        })
      });
    });
};