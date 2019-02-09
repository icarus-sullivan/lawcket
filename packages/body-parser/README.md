# @lawcket/body-parser
![Downloads][link-download] ![Version][link-version] ![License][link-license]

#### Middleware for @lawcket/websocket that parses body information

## Installation

```sh
npm install @lawcket/websocket @lawcket/body-parser
```
or
```sh
yarn add @lawcket/websocket @lawcket/body-parser
```

## Usage

By default, the @lawcket/websocket implementation does not modify incoming body data. Automatically parsing base64 or json stringified content, is as easy as adding the middleware to our @lawcket/websocket configuration. 

```javascript
const bodyParser = require('@lawcket/body-parser');
const LambdaWebSocket = require('@lawcket/websocket');

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

[link-download]: https://img.shields.io/npm/dt/@lawcket/body-parser.svg
[link-version]: https://img.shields.io/npm/v/@lawcket/body-parser.svg
[link-license]: https://img.shields.io/npm/l/@lawcket/body-parser.svg