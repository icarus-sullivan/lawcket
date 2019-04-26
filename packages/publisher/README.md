# @lawcket/publisher
![Downloads][link-download] ![Version][link-version] ![License][link-license]

Middleware for @lawcket/websocket injects publish method. 

# Installation
`yarn add @lawcket/publisher`

or 

`npm install @lawcket/publisher`

### Manual client building 
In normal use-cases you shouldn't need to manually build the client. @lawcket/websockets already creates a publish function once the client is connected. However, in case you want to reconstruct publish communications, the following example illustrates how to. 

Example:

```
// non-ES6
// const { builder } = require('@lawcket/publisher');

// ES6
import { builder } from '@lawcket/publisher';

// create the communication client
const client = builder({ 
    stage: 'test',
    domainName: 'test.execute-api.us-west-2.amazonaws.com',
    connectionId: 'testId',
});

// send a message 
client({ foo: 'bar' }).then((res) => console.log('yay', res));
```

[link-download]: https://img.shields.io/npm/dt/@lawcket/publisher.svg
[link-version]: https://img.shields.io/npm/v/@lawcket/publisher.svg
[link-license]: https://img.shields.io/npm/l/@lawcket/publisher.svg