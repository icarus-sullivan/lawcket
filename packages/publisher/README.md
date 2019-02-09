# @lws/publisher
![Downloads][link-download] ![Version][link-version] ![License][link-license]

#### Middleware for @lws/websocket that parses body information

## Installation

```sh
npm install @lws/websocket @lws/publisher
```
or
```sh
yarn add @lws/websocket @lws/publisher
```

## Usage

Sending a message back to the client will not work for `close` and `connect` events. These instances operate in a handshake mode, or connection disruptions mode. This means that only the `message` event will allow you to send messages back to the client. 

```javascript
const publisherMiddleware = require('@lws/publisher');
const LambdaWebSocket = require('@lws/websocket');

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

[link-download]: https://img.shields.io/npm/dt/@lws/publisher.svg
[link-version]: https://img.shields.io/npm/v/@lws/publisher.svg
[link-license]: https://img.shields.io/npm/l/@lws/publisher.svg