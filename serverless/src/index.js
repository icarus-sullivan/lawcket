const lambdaWebsocket = require('@lawcket/websocket');

const authMiddleware = (event) => {
  const token = event.headers.Authorization;
  if (!token) {
    throw new Error('Not authorized');
  }

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

const internalHandler = async (event, connection, publish) => {
  console.log(`Connection: ${JSON.stringify(connection, null, 2)}`);
  // publish is only available during a message event
  if (connection.event === 'message' && publish) {
    await publish({ message: 'hello from server' });
  }
};

const socket = lambdaWebsocket(handler, { 
  plugins: [dynamoSyncPlugin],
  middleware: []
});

module.exports = {
  default: socket,
};
