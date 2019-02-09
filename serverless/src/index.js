const DynamoPlugin = require('@lws/config/packages/dynamo');
const PublisherPlugin = require('@lws/config/packages/publisher');
const LambdaWebSocket = require('@lws/config/packages/websocket');

const dynamoPlugin = new DynamoPlugin({
  tableName: process.env.CONNECTIONS_TABLE,
  additionalSyncFields: {
    channel: '#general',
  },
});

const publisherPlugin = new PublisherPlugin({
  secure: true,
});

const lambdaSocket = new LambdaWebSocket({
  plugins: [
    dynamoPlugin,
    publisherPlugin,
  ],
});

lambdaSocket.on('connect', async (event) => {
  
});

lambdaSocket.on('message', async ({ send }) => {

  await send({ message: 'hello from server' });
});

lambdaSocket.on('close', async (event) => {

});

module.exports = {
  default: lambdaSocket.createHandler(),
};
