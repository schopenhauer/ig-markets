# ig-markets

A basic wrapper for the IG Markets REST API written in Node.js. Please refer to the official [documentation](https://labs.ig.com/rest-trading-api-guide) for more information on [API endpoints](https://labs.ig.com/rest-trading-api-reference).

## Installation

Note: Without tanspiling this will require node with --harmony flag to run

```
npm install ig-markets --save
```

## Usage

```node
const IG = require('ig-markets');
const ig = new IG(key, identifier, password, isDemo);

try {
  const data = await ig.prices('CS.D.EURUSD.MINI.IP');
  console.log(data);
} catch(e) {
  console.error(e);
}

```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/schopenhauer/ig-markets.

## License

The module is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
