const rest = require('restler');

let API = 'https://api.ig.com/gateway/deal/';
const DEMO_API = 'https://demo-api.ig.com/gateway/deal/';

/**
 * Constructor
 *
 * @param {string} key - Your IG Markets account key.
 * @param {string} identifier - Your IG Markets username.
 * @param {string} password - Your IG Markets password.
 * @param {bool} isDemo - Flag if this is demo account
 */
const IG = function (key, identifier, password, isDemo) {
  if (!key || !identifier || !password) {
    throw new Error('key, identifier and password are required');
  }

  if(isDemo) {
    API = DEMO_API;
  }

  this.maxRequestAttempts = 4;
  this.key = key;
  this.identifier = identifier;
  this.password = password;
  this.token = null;
  this.cst = null;
  this.login();
};

/**
 * Make a HTTP(S) request.
 *
 * @param {string} method - The HTTP method used.
 * @param {string} action - The action path appended to URL.
 * @param {string} data - The data passed to HTTP request.
 * @param {integer} version - The version number passed to header.
*/
IG.prototype._request = async function (method, action, data = null, version = 2, attempt = 0) {
  try {
    return await new Promise((resolve, reject) => {
      if(!['post', 'get'].includes(method)) {
        new Error('Error: HTTP method not defined, please review API call');
      }
      const headers = this.getHeaders(version);
      const url = API + action;
      const request = method === 'post' ? rest.postJson : rest.json;

      request(url, data, { headers }).on('complete', function (data, res) {
        data.res = res;
        resolve(data);
      }).on('error', reject);
    });
  } catch(e) {
    attempt++;
    if(attempt >= this.maxRequestAttempts) {
      console.error(`ERROR: Action "${action}" has been reattempted too many times.`);
    }
    // error so try again
    console.log(`REQUEST ${action} FAILED, RETRYING ${attempt}/${this.maxRequestAttempts}`);
    await wait(500);
    return await this._request(...arguments);
  }

  function wait(ms) {
    return new Promise((resolve) => {
      setTimeout(() => { resolve(); }, ms);
    });
  }
};

/** Account */

// Creates a trading session, obtaining session tokens for subsequent API access
IG.prototype.login = async function() {
  var credentials = {
    'identifier': this.identifier,
    'password': this.password,
    'encryptedPassword': null // TODO: encryptedPassword: true
  };

  const data = await this._request('post', 'session', credentials);
  this.cst = data.res.headers['cst'];
  this.token = data.res.headers['x-security-token'];
};

IG.prototype.getHeaders = function (version) {
  return {
    'Content-Type': 'application/json; charset=UTF-8',
    'Accept': 'application/json; charset=UTF-8',
    'Version': version,
    'X-IG-API-KEY': this.key,
    'X-SECURITY-TOKEN': this.token || '',
    'CST': this.cst || ''
  };
};

// Creates a trading session, obtaining session tokens for subsequent API access
IG.prototype.sessionEncryptionKey = async function () {
  return await this._request('post', 'session/encryptionKey', null, 1);
};

// Log out of the current session
IG.prototype.logout = async function () {
  return await this._request('delete', 'session', null, 1);
};

// Returns a list of accounts belonging to the logged-in client
IG.prototype.accounts = async function () {
  return await this._request('get', 'accounts', null, 1);
};

// Returns the account activity history.
IG.prototype.accountHistory = async function () {
  return await this._request('get', 'history/activity', null, 3);
};

// Returns the account activity history.
IG.prototype.accountHistory2 = async function () {
  return await this._request('get', 'history/activity/2000', null, 3);
};

// Returns the transaction history. By default returns the minute prices within the last 10 minutes.
IG.prototype.accountTransactions = async function () {
  return await this._request('get', 'history/transactions');
};

/** Dealing */

// Returns all open positions for the active account.
IG.prototype.positions = async function () {
  return await this._request('get', 'positions');
};

IG.prototype.openPosition = async function (data) {
  return await this._request('post', 'positions/otc', data);
};

// Returns all open sprint market positions for the active account.
IG.prototype.positionsSprintMarkets = async function () {
  return await this._request('get', 'positions/sprintmarkets');
};

// Returns all open working orders for the active account.
IG.prototype.workingOrders = async function () {
  return await this._request('get', 'workingorders');
};

/** Markets */

// Returns all markets matching the search term.
IG.prototype.findMarkets = async function (keyword) {
  return await this._request('get', 'markets?searchTerm=' + keyword, null, 1);
};

// Returns historical prices for a particular instrument.
// By default returns the minute prices within the last 10 minutes.
IG.prototype.prices = async function (epic) {
  return await this._request('get', 'prices/' + epic, null, 3);
};

/** Watchlists */

// Returns all watchlists belonging to the active account.
IG.prototype.watchlists = async function () {
  return await this._request('get', 'watchlists', null, 1);
};

module.exports = IG;
