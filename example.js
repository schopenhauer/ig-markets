var IG = require('./lib/ig');
var ig = new IG(
    process.env.IG_KEY,
    process.env.IG_IDENTIFIER,
    process.env.IG_PASSWORD
);

ig.prices('CS.D.EURUSD.MINI.IP', function (err, data) {
    if (err) {
        console.error(err);
    } else {
        console.log(data);
    }
});

ig.findMarkets('EURUSD', function (err, data) {
    if (err) {
        console.error(err);
    } else {
        console.log(data);
    }
});

ig.accounts(function (err, data) {
    if (err) {
        console.error(err);
    } else {
        console.log(data);
    }
});