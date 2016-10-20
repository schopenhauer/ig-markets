//var should = require('chai').should();

var IG = require('../lib/ig');
var ig = new IG(
    process.env.IG_KEY,
    process.env.IG_IDENTIFIER,
    process.env.IG_PASSWORD
);

var epic = 'CS.D.EURUSD.MINI.IP';
var searchTerm = 'EURUSD';

describe('Accounts', function () {

    it('/accounts', function () {
        ig.accounts(function (err, data) {
            if (err) done(err);
            else done();
        });
    });

});


describe('Markets', function () {

    it('/prices/' + epic, function () {
        ig.prices(epic, function (err, data) {
            if (err) done(err);
            else done();
        });
    });

    it('/markets?searchTerm=' + searchTerm, function () {
        ig.findMarkets(searchTerm, function (err, data) {
            if (err) done(err);
            else done();
        });
    });

});
