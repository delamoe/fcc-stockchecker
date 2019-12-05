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

    /* test('1 stock', function (done) {
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: 'goog' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          console.log(res.body.stockData);
          assert.property(res.body, 'stockData', 'the body should contain an object with a property stockData');
          assert.property(res.body.stockData, 'stock', 'there should be a property stock');
          assert.property(res.body.stockData, 'price', 'there should be a property price');
          assert.property(res.body.stockData, 'likes', 'there should be a property likes');

          //complete this one too

          done();
        });
    }); */

    /*  test('1 stock with like', function(done) {
       
     }); */

    /*  test('1 stock with like again (ensure likes aren\'t double counted)', function(done) {
       
     }); */

    test('2 stocks', function (done) {

      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: ['goog', 'msft'] })
        .end(function (err, res) {
          console.log(res.body);
          assert.property(res.body, 'stockData', 'the body should contain an object with a property stockData');

          //complete this one too

          done();
        });
    });

    /*  test('2 stocks with like', function(done) {
       
     }); */

  });

});
