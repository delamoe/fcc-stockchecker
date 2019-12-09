var fetch = require('node-fetch');


var test = () => fetch(`https://repeated-alpaca.glitch.me/v1/stock/goog/quote`)
.then(res => res.json())
.then(data => {
  if (data.symbol !== 'GOOG') console.log(data);
  else {console.log(true)};
},err => console.log(err));

var testRunner = setInterval(test, 10000);
var stop = () => clearInterval(testRunner);

if (test === false) stop();