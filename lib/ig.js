//console.log = function() {}

var rest = require('restler');
var async = require('async');

const API = 'https://api.ig.com/gateway/deal/';
const DEMO_API = 'https://demo-api.ig.com/gateway/deal/';


/**
 * Constructor
 *
 * @param {string} key - Your IG Markets account key.
 * @param {string} identifier - Your IG Markets username.
 * @param {string} password - Your IG Markets password.
 */

var IG = function (key, identifier, password, isDemo) {
    this.key = key;
    this.identifier = identifier;
    this.password = password;
    this.token = null;
    this.cst = null;
    if(isDemo) {
        API = DEMO_API;
    }
};

/**
 * Make a HTTP(S) request.
 *
 * @param {string} method - The HTTP method used.
 * @param {string} action - The action path appended to URL.
 * @param {string} data - The data passed to HTTP request.
 * @param {integer} version - The version number passed to header.
 * @param {callback} callback - The callback parameter.
 */

IG.prototype._request = function (method, action, data, version, callback) {

    var key = this.key;
    var identifier = this.identifier;
    var password = this.password;
    var token = this.token || '';
    var cst = this.cst || '';

    var headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
        'Version': 2,
        'X-IG-API-KEY': key,
        'X-SECURITY-TOKEN': token,
        'CST': cst
    };

    async.series([

            function (callback) {

                var credentials = {
                    'identifier': identifier,
                    'password': password,
                    'encryptedPassword': null // TODO: encryptedPassword: true
                };

                if (!cst && !token) {
                    //console.log('logging in... ');
                    //console.log(headers);

                    if (!key || !identifier || !password)
                        return callback(new Error('Must provide key, identifier and password to make this API request.'));

                    rest.postJson(API + 'session', credentials, {headers: headers}).on('complete', function (data, res) {
                        this.cst = res.headers["cst"];
                        this.token = res.headers["x-security-token"];
                        headers['CST'] = this.cst;
                        headers['X-SECURITY-TOKEN'] = this.token;
                        //console.log('logging in... token: ' + this.token);
                        callback(null);
                    });

                } else {
                    //console.log('found token: ' + this.token);
                    callback(null);
                }

            },
            function (callback) {

                //console.log('next step --');

                headers['Version'] = version;

                var url = API + action;

                switch (method) {

                    case 'post':
                        rest.postJson(url, data, {headers: headers}).on('complete', function (data, res) {
                            //console.log('post : ' + url);
                            callback(null, data);
                        });
                        break;

                    case 'get':
                        rest.json(url, data, {headers: headers}).on('complete', function (data, res) {
                            //console.log('get : ' + url);
                            //console.log(data);
                            callback(null, data);
                        });
                        break;

                    default:
                        return callback(new Error('Error: HTTP method not defined, please review API call'));

                }
            }
        ],

        function (err, results) {
            if (err) {
                //console.error('error: unknown error occurred');
                callback(err);
            } else {
                //console.log('all good');
                callback(null, results[1]);
            }
        });

};

/**
 * Account
 *
*/

// Creates a trading session, obtaining session tokens for subsequent API access
IG.prototype.login = function (callback) {
    this._request('post', 'session', null, 2, callback);
};

// Creates a trading session, obtaining session tokens for subsequent API access
IG.prototype.sessionEncryptionKey = function (callback) {
    this._request('post', 'session/encryptionKey', null, 1, callback);
};

// Log out of the current session
IG.prototype.logout = function (callback) {
    this._request('delete', 'session', null, 1, callback);
};

// Returns a list of accounts belonging to the logged-in client
IG.prototype.accounts = function (callback) {
    this._request('get', 'accounts', null, 1, callback);
};

// Returns the account activity history.
IG.prototype.accountHistory = function (callback) {
    this._request('get', 'history/activity', null, 3, callback);
};

// Returns the transaction history. By default returns the minute prices within the last 10 minutes.
IG.prototype.accountTransactions = function (callback) {
    this._request('get', 'history/transactions', null, 2, callback);
};

/**
 * Dealing
 *
 */

// Returns all open positions for the active account.
IG.prototype.positions = function (callback) {
    this._request('get', 'positions', null, 2, callback);
};

// Returns all open sprint market positions for the active account.
IG.prototype.positionsSprintMarkets = function (callback) {
    this._request('get', 'positions/sprintmarkets', null, 2, callback);
};

// Returns all open working orders for the active account.
IG.prototype.workingOrders = function (callback) {
    this._request('get', 'workingorders', null, 2, callback);
};

/**
 * Markets
 *
 */

// Returns all markets matching the search term.
IG.prototype.findMarkets = function (keyword, callback) {
    this._request('get', 'markets?searchTerm=' + keyword, null, 1, callback);
};

// Returns historical prices for a particular instrument.
// By default returns the minute prices within the last 10 minutes.
IG.prototype.prices = function (epic, callback) {
    this._request('get', 'prices/' + epic, null, 3, callback);
};

/**
 * Watchlists
 *
 */

// Returns all watchlists belonging to the active account.
IG.prototype.watchlists = function (callback) {
    this._request('get', 'watchlists', null, 1, callback);
};

module.exports = IG;
