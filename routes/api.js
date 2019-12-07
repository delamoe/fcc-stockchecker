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
      // console.log('req.ip: ', req.ip);
      // console.log('req.query: ', req.query);
      var stocks = [];
      if (Array.isArray(req.query.stock)) stocks = req.query.stock.map(stock => stock.toUpperCase());
      else stocks.push(req.query.stock.toUpperCase());

      Promise.all(stocks.map(stock => fetch(`https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`)))
        .then(data => Promise.all(data.map(data => data.json())))
        .then(stockData => {
          MongoClient.connect(MONGODB_CONNECTION_STRING, { useUnifiedTopology: true }, function (err, db) {
            if (err) return console.error(err);
            var stock_db = db.db('test').collection('stock_db');
            Promise.all([
              stocks.forEach(stock => {
                stock_db.updateOne(
                  { symbol: stock },
                  { $set: { symbol: stock } },
                  { upsert: true })
              }),
              req.query.like === 'true' ?
                stock_db.updateMany(
                  { symbol: { $in: stocks }, likedBy: { $not: { $elemMatch: { $eq: req.ip } } } },
                  {
                    $inc: { likes: 1 },
                    $push: { likedBy: req.ip }
                  })
                : 0
            ]).then(() => {
              var stockInfo = stock_db.find(
                { symbol: { $in: stocks } });

              stockInfo.toArray().then(likeInfo => {
                var result = stockData.map((stock, index) => {
                  return stockData.length === 1 ?
                    {
                      "stock": stock.symbol,
                      "price": ` ${stock.latestPrice}`,
                      "likes": likeInfo[0].likes || 0
                    } :
                    {
                      "stock": stock.symbol,
                      "price": ` ${stock.latestPrice}`,
                      "rel_likes": index < 1 ? (likeInfo[0].likes || 0) - (likeInfo[1].likes || 0) : (likeInfo[1].likes || 0) - (likeInfo[0].likes || 0)
                    };
                });
                res.json({ "stockData": result.length < 2 ? result[0] : result });
              });
              db.close();
            })/* .finally(); */
          })
        })
    })
    /* .delete(function (req, res) {
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useUnifiedTopology: true }, function (err, db) {
        if (err) return console.error(err);
        var stock_db = db.db('test').collection('stock_db');
        var stocks = [];
        if (Array.isArray(req.query.stock)) stocks = req.query.stock.map(stock => stock.toUpperCase());
        else stocks.push(req.query.stock.toUpperCase());

        stocks.forEach(stock => stock_db.deleteOne({ symbol: stock })
          .then(data => console.log(data))
          .then(() => db.close()));
      })
    }) */
};