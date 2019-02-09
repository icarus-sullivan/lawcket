# @lws/body-parser
![Downloads][link-download] ![Version][link-version] ![License][link-license]

#### Middleware for @lws/websocket that parses body information

## Installation

```sh
npm install @lws/websocket @lws/body-parser
```
or
```sh
yarn add @lws/websocket @lws/body-parser
```

## Usage

By default, the @lws/websocket implementation does not modify incoming body data. Automatically parsing base64 or json stringified content, is as easy as adding the middleware to our @lws/websocket configuration. 

```javascript
const bodyParser = require('@lws/body-parser');
const LambdaWebSocket = require('@lws/websocket');

const lambdaSocket = new LambdaWebSocket({
  middleware: [bodyParser],
});

// const fakeEvent = {
//    body: "{\"foo\":\"bar\"}"
// };
lambdaSocket.on('message', async (event) => {
    console.log(event.body); // { "foo": "bar" } 
});

lambdaSocket.on('connect', async (event) => {});

lambdaSocket.on('close', async (event) => {});


module.exports = {
  default: lambdaSocket.createHandler(),
};
```

#### Caveats

Currently the middleware only tries to auto-parse json data. If the base64 contents is not an encoded json object, then the original base64 encoded string will be provided. This also goes for non-json strings. 

[link-download]: https://img.shields.io/npm/dt/@lws/body-parser.svg
[link-version]: https://img.shields.io/npm/v/@lws/body-parser.svg
[link-license]: https://img.shields.io/npm/l/@lws/body-parser.svg