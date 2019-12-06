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
      console.log('req.query: ', req.query);
      var stocks = [];
      if (Array.isArray(req.query.stock)) stocks = req.query.stock.map(stock => stock.toUpperCase());
      else stocks.push(req.query.stock.toUpperCase());
      console.log('stocks (should be uppercase) ', stocks);


      Promise.all(stocks.map(stock => fetch(`https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`)))
        .then(data => Promise.all(data.map(data => data.json())))
        .then(stockData => {

          MongoClient.connect(MONGODB_CONNECTION_STRING, { useUnifiedTopology: true }, function (err, db) {
            if (err) return console.error(err);
            var stock_db = db.db('test').collection('stock_db');

            stocks.forEach(stock => {
              var stockCreate = stock_db.updateOne(
                { symbol: stock },
                { $set: { symbol: stock } },
                { upsert: true });

              stockCreate.then(data => console.log(data.result));
            });

            // if (req.query.like === true && req.ip !== [likedBy]){
            // $inc: { like: 1 }
            // [likedBy].push(req.ip)
            // }
            console.log('req.ip: ', req.ip);

            var stockUpdate = stock_db.updateMany(
              { symbol: { $in: stocks }, likedBy: { $not: { $eq: req.ip } } },
              {
                $inc: { likes: 1 },
                $push: { likedBy: req.ip }
              });

              stockUpdate.then(data => {
                console.log('stockUpdate: modified ', data.modifiedCount)});

    
                // work to be done here
                var stockCheck = stock_db.find(
                  { symbol: { $in: stocks } });
    
                stockCheck.toArray().then(data => {
                  console.log('stockCheck: ', data)
                
              // need to access likes...

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