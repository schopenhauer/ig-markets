# ig-markets

A basic wrapper for the IG Markets REST API written in Node.js. Please refer to the official [documentation](https://labs.ig.com/rest-trading-api-guide) for more information on [API endpoints](https://labs.ig.com/rest-trading-api-reference).

## Installation

```
npm install ig-markets --save
```

## Usage

```node
var IG = require('ig-markets');
var ig = new IG(key, identifier, password);

ig.prices('CS.D.EURUSD.MINI.IP', function(err, data) {
  if (err) {
    console.error(err);
  } else {
    console.log(data);
  }
});
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/schopenhauer/ig-markets.

## License

The module is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
