const DynamoPlugin = require('@lawcket/dynamo');
const publisherMiddleware = require('@lawcket/publisher');
const bodyParser = require('@lawcket/body-parser');
const LambdaWebSocket = require('@lawcket/websocket');

const dynamoPlugin = new DynamoPlugin({
  tableName: process.env.CONNECTIONS_TABLE,
  additionalSyncFields: {
    channel: '#general',
  },
});

const lambdaSocket = new LambdaWebSocket({
  middleware: [bodyParser, publisherMiddleware],
  plugins: [
    dynamoPlugin,
  ],
});

lambdaSocket.on('connect', async ({ headers, requestContext }) => {
  // do authorization here with headers. If unauthorized throw an error.
  console.log('headers', headers);
  console.log('client connected', requestContext.connectionId);
});

lambdaSocket.on('message', async ({ body, send }) => {
  console.log('client said', body);
  await send({ message: 'hello from server' });
});

lambdaSocket.on('close', async (event) => {
  console.log('client closed', event.requestContext.connectionId);
});

module.exports = {
  default: lambdaSocket.createHandler(),
};
