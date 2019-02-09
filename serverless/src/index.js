const DynamoPlugin = require('@lws/config/packages/dynamo');
const publisherMiddleware = require('@lws/config/packages/publisher');
const bodyParser = require('@lws/config/packages/body-parser');
const LambdaWebSocket = require('@lws/config/packages/websocket');

const dynamoPlugin = new DynamoPlugin({
  tableName: process.env.CONNECTIONS_TABLE,
  additionalSyncFields: {
    channel: '#general',
  },
});

console.log('dynamoPlugin', dynamoPlugin);

const lambdaSocket = new LambdaWebSocket({
  middleware: [bodyParser, publisherMiddleware],
  plugins: [
    dynamoPlugin,
  ],
});

lambdaSocket.on('connect', async (event) => {
  console.log('connect event', JSON.stringify(event, null, 2));
});

lambdaSocket.on('message', async (event) => {
  console.log('message event', JSON.stringify(event, null, 2));
  console.log('has send method', event.hasOwnProperty('send'));
  await event.send({ message: 'hello from server' });
});

lambdaSocket.on('close', async (event) => {
  console.log('close event', JSON.stringify(event, null, 2));
});

module.exports = {
  default: lambdaSocket.createHandler(),
};
