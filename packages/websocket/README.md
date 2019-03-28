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
yarn add @lawcket/websocket
yarn add -D serverless-websockets-plugin
```

## Usage

#### lambdaWebSocket(handler, options?)
- `handler`: <AsyncFunction> | <Function>
    - `event`: <LambdaEvent>
    - `connection`: <Object> 
        - `stage`: <String> 
        - `domainName`: <String> 
        - `connectionId`: <String>
        - `event`: <String> 'close' | 'connect' | 'message'
    - `publish`: <AsyncFunction> used to send messages to the client (only available within 'message' events)
- `options`: <Object>
    - `plugins`: <Functions[]>
    - `middleware`: <Function[]>

#### Middleware
Middleware are used to modify or interrupt the lambda event. An excellent use-case for this is authentication. Internally @lawcket/websocket uses a middleware to automatically parse incoming body data. 

#### Plugins
Plugins mimic the handler and are called asynchronously with the same parameters. A good use case for this is storing connection information, or for processing asynchronous connection-related tasks that do not pertain to the general flow of the lambda. 

## Example

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
const lambdaWebsocket = require('@lawcket/websocket');

const authMiddleware = (event) => {
  const token = event.headers.Authorization;
  if (!token) {
    throw new Error('Unauthorized');
  }

  // ...additional verification
  return event;
}

const dynamoSyncPlugin = (event, connection) => {
  if (connection.event === 'close') {
    // remove dynamo record
  }
  if (connection.event === 'connect') {
    // store connection to dynamo
  }
}

const handler = async (event, connection, publish) => {
  console.log(`Connection: ${JSON.stringify(connection, null, 2)}`);
  // publish is only available during a message event
  if (connection.event === 'message' && publish) {
    await publish({ message: 'hello from server' });
  }
};

const socket = lambdaWebsocket(handler, { 
  plugins: [dynamoSyncPlugin],
  middleware: [authMiddleware]
});

module.exports = {
  default: socket,
};
```

Note: connections can be disrupted. Additionally asynchronous commands might need to be broadcasted to multiple connections. It is suggested that a custom plugin be created to sync connections to DynamoDB or another storage solution. This can help with rebuilding connections or notifying clients that the connection has closed.

[Here](https://github.com/icarus-sullivan/lawcket/tree/master/serverless) is a full example of @lawcket/websocket usage. It includes body parsing, publishing, as well as dynamo syncing of clients. 

[link-download]: https://img.shields.io/npm/dt/@lawcket/websocket.svg
[link-version]: https://img.shields.io/npm/v/@lawcket/websocket.svg
[link-license]: https://img.shields.io/npm/l/@lawcket/websocket.svg