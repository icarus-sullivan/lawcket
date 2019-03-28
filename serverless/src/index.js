const lambdaWebsocket = require('@lawcket/websocket');

const authMiddleware = (event) => {
  console.log('authorizing middleware');
  return event;
}

const dynamoSyncPlugin = (event, connection) => {
  console.log('syncing dynamo', connection);
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

module.exports = {
  default: lambdaWebsocket(handler, { 
    plugins: [dynamoSyncPlugin],
    middleware: [authMiddleware]
  }),
};
