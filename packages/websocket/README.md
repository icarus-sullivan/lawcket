# @lawcket/websocket
![Downloads][link-download] ![Version][link-version] ![License][link-license]

#### A pluggable API Gateway Lambda wrapper that mimics server websockets

**NOTE:**
Supports Serverless >=1.38 
For pre-1.38 use [@lawcket/websockets@0.1.4](https://www.npmjs.com/package/@lawcket/websocket/v/0.1.4)

## Installation

```sh
npm install @lawcket/websocket
```
or
```sh
yarn add @lawcket/websocket
```

## Usage

##### Servereless Project

Configure your function to accept all routes/actions. 

Example:

```
functions:
  websocket:
    handler: src/index.default
    memorySize: 3008
    events:
      - websocket:
          route: $connect
      - websocket:
          route: $disconnect
      - websocket:
          route: $default
```

##### Lambda
The lambda will need to be constructed by the @lawcket/websocket library. It modifies incoming messages and handles the federation of middleware and plugins. 

Example:
```javascript
// pre-ES6
// const lawcket = require('@lawcket/websocket');

// ES6
import lawcket from '@lawcket/websocket';

const handler = async (event, connection, publish) => {
  console.log(`Connection: ${JSON.stringify(connection, null, 2)}`);
  // publish is only available during a message event
  if (connection.event === 'message' && publish) {
    await publish({ message: 'hello from server' });
  }
};

export default lawcket({
  middleware: [],
  plugins: [],
  handler,
});
```

The lambda implementation will be called with three params; event, connection, and publish. 

_event_:
- the original lambda event
- contains header information during a `CONNECT` request

_connection_: 
 - a subset of collection info, useful for storing
 - object structure
     - event: 'close' | 'connect' | 'message'
     - connectionId: string
     - stage: string,
     - domainName: string
 
_publish_:
- only available during a `message` event
- needs to be called asynchronously 
- supports base64, or stringifiable data


##### Plugins
Plugins mimic how the handler is called and is invoked asychronously. A good use case for this is storing connection information, or for processing connection-related tasks that do not pertain to the general flow of the lambda. 

Example:
```
import lawcket from '@lawcket/websocket';

// ... handler here

const dynamo = async  (originalEvent, connection) => {
    if (connection.event === 'connect') {
        // store connection to dynamo
    }
    if (connection.event === 'close') {
        // remove connection from dynamo
    }
}

export default lawcket({
  middleware: [],
  plugins: [dynamo],
  handler,
});
```

#### Middleware
Middleware are used to modify or interrupt the lambda event. An excellent use-case for this is authentication. Internally @lawcket/websocket uses a middleware to automatically parse incoming body data. Be aware, middleware are processed in-order.

Example:
```
import lawcket from '@lawcket/websocket';

// ... handler here

const auth = (originalEvent) => {
    const { requestContext, headers } = originalEvent;
    if (headers && headers.Authorization 
        && requestContext.eventType === 'CONNECT') {
        // check authorization here
    }
    
    // middleware must return the event if not throwing
    return originalEvent;
}

export default lawcket({
  middleware: [auth],
  plugins: [],
  handler,
});
```


Click [here](https://github.com/icarus-sullivan/lawcket/tree/master/serverless) for a full example of @lawcket/websocket usage.

[link-download]: https://img.shields.io/npm/dt/@lawcket/websocket.svg
[link-version]: https://img.shields.io/npm/v/@lawcket/websocket.svg
[link-license]: https://img.shields.io/npm/l/@lawcket/websocket.svg