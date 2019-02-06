const dynamoSync = require('lws/packages/dynamo');
const createPublisher = require('lws/packages/publisher');
const LambdaWebSocket = require('lws/packages/websocket');

const dynamo = dynamoSync({
  tableName: process.env.CONNECTIONS_TABLE,
  sync: true,
});

const lambdaSocket = new LambdaWebSocket();

lambdaSocket.on('connect', async (event) => {
  await dynamo.sync(event, {
    channel: 'gifs',
  });
});

lambdaSocket.on('message', async (event) => {
  const connection = await dynamo.restore(event);
  const send = await createPublisher(connection);

  await send({ message: 'hello from server' });
});

lambdaSocket.on('disconnect', async (event) => {
  await dynamo.release(event);
});

module.exports = {
  default: lambdaSocket.createHandler(),
};
