# @lawcket/websocket
![Downloads][link-download] ![Version][link-version] ![License][link-license]

#### A pluggable API Gateway Lambda wrapper that mimics server websockets

## Installation

```sh
npm install @lawcket/websocket
npm install -D serverless-websockets-plugin
```
or
```sh
yarn add @lawcket/websocket @lawcket/websocket
yarn add -D serverless-websockets-plugin
```

## Usage

In your serverless.yml file, configure the @lawcket/websocket lambda. 

```
plugins:
  - serverless-websockets-plugin

functions:
  websocket:
    handler: src/index.default
    memorySize: 3008
    events:
      - websocket:
          routeKey: $connect
      - websocket:
          routeKey: $disconnect
      - websocket:
          routeKey: $default
```

Then create your handler, using the @lawcket/websocket library. 

_src/index.js_
```javascript
const LambdaWebSocket = require('@lawcket/websocket');

const lambdaSocket = new LambdaWebSocket({});

lambdaSocket.on('connect', async (event) => {
    // connect is the only time headers are passed, authorize here
    const { headers } = event;
    console.log('client connected', event.requestContext.connectionId);
});

lambdaSocket.on('message', async (event) => {
  console.log('client said', event.body);
});

lambdaSocket.on('close', async (event) => {
  console.log('client disconnected', event.requestContext.connectionId);
});

module.exports = {
  default: lambdaSocket.createHandler(),
};
```

#### Caveats

Connections can be disrupted for any number or reasons. Using a library like @lawcket/dynamo to sync connections can help publish commands to interrupted clients. 

[Here](https://github.com/icarus-sullivan/lawcket/tree/master/serverless) is a full example of @lawcket/websocket usage. It includes body parsing, publishing, as well as dynamo syncing of clients. 

[link-download]: https://img.shields.io/npm/dt/@lawcket/websocket.svg
[link-version]: https://img.shields.io/npm/v/@lawcket/websocket.svg
[link-license]: https://img.shields.io/npm/l/@lawcket/websocket.svg