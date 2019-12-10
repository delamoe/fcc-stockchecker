/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  suite('GET /api/stock-prices => stockData object', function () {

    test('1 stock', function (done) {
      this.timeout(15000);
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: 'aapl', test: true })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          console.log(res.body);
          assert.property(res.body, 'stockData', 'the body should contain an object with a property stockData');
          assert.property(res.body.stockData, 'stock', 'there should be a property stock');
          assert.property(res.body.stockData, 'price', 'there should be a property price');
          assert.property(res.body.stockData, 'likes', 'there should be a property likes');
          done();
        });
    });

    test('1 stock with like', function (done) {
      this.timeout(15000);
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: 'goog', like: true, test: true })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          console.log(res.body);
          assert.property(res.body, 'stockData', 'the body should contain an object with a property stockData');
          assert.property(res.body.stockData, 'stock', 'there should be a property stock');
          assert.property(res.body.stockData, 'price', 'there should be a property price');
          assert.property(res.body.stockData, 'likes', 'there should be a property likes');
          assert.equal(res.body.stockData.likes, 1, 'likes should be one`')
          done();
        });

    });

    test('1 stock with like again (ensure likes aren\'t double counted)', function (done) {
      this.timeout(15000);
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: 'goog', like: true, test: true })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          console.log(res.body);
          assert.property(res.body, 'stockData', 'the body should contain an object with a property stockData');
          assert.property(res.body.stockData, 'stock', 'there should be a property stock');
          assert.property(res.body.stockData, 'price', 'there should be a property price');
          assert.property(res.body.stockData, 'likes', 'there should be a property likes');
          assert.equal(res.body.stockData.likes, 1, 'likes should still be one`')
          done();
        });

    });

    test('2 stocks', function (done) {
      this.timeout(15000);
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: ['goog', 'msft'], test: true })
        .end(function (err, res) {
          console.log(res.body);
          assert.property(res.body, 'stockData', 'the body should contain an object with a property stockData');
          assert.isArray(res.body.stockData);
          assert.property(res.body.stockData[1], 'stock', 'there should be a property stock');
          assert.property(res.body.stockData[1], 'price', 'there should be a property price');
          assert.property(res.body.stockData[1], 'rel_likes', 'there should be a property rel_likes');
          done();
        });
    });

    test('2 stocks with like', function (done) {
      this.timeout(15000);
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: ['goog', 'msft'], like: true, test: true })
        .end(function (err, res) {
          console.log(res.body);
          assert.property(res.body, 'stockData', 'the body should contain an object with a property stockData');
          assert.isArray(res.body.stockData);
          assert.property(res.body.stockData[1], 'stock', 'there should be a property stock');
          assert.property(res.body.stockData[1], 'price', 'there should be a property price');
          assert.property(res.body.stockData[1], 'rel_likes', 'there should be a property rel_likes');
          assert.equal(res.body.stockData[0].rel_likes, 0, 'rel_likes should equal 0');
          assert.equal(res.body.stockData[1].rel_likes, 0, 'rel_likes should equal 0');
          done();
        });
    });

  });

  suite('DELETE /api/stock-prices => deletes all stockData test objects', function () {
    test('delete all test stocks', function (done) {
      chai.request(server)
        .delete('/api/stock-prices')
        .end((err, res) => {
          if (err) console.error(err);
          assert.equal(res.text, 'test data deleted successful');
          done();
        });
    });
  });

});
