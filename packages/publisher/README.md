# @lawcket/publisher
![Downloads][link-download] ![Version][link-version] ![License][link-license]

#### Middleware for @lawcket/websocket that parses body information

## Installation

```sh
npm install @lawcket/websocket @lawcket/publisher
```
or
```sh
yarn add @lawcket/websocket @lawcket/publisher
```

## Usage

Sending a message back to the client will not work for `close` and `connect` events. These instances operate in a handshake mode, or connection disruptions mode. This means that only the `message` event will allow you to send messages back to the client. 

```javascript
const publisherMiddleware = require('@lawcket/publisher');
const LambdaWebSocket = require('@lawcket/websocket');

const lambdaSocket = new LambdaWebSocket({
  middleware: [publisherMiddleware],
});

lambdaSocket.on('message', async (event) => {
    // send is injected into the event via the middleware
    const { send } = event;
    console.log(`client said ${event.body}`);
    await send({ message: 'hello from server' });
});

lambdaSocket.on('connect', async (event) => {});
lambdaSocket.on('close', async (event) => {});

module.exports = {
  default: lambdaSocket.createHandler(),
};

```

[link-download]: https://img.shields.io/npm/dt/@lawcket/publisher.svg
[link-version]: https://img.shields.io/npm/v/@lawcket/publisher.svg
[link-license]: https://img.shields.io/npm/l/@lawcket/publisher.svg