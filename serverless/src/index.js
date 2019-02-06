const dynamoSync = require('lws/packages/dynamo');
const createPublisher = require('lws/packages/publisher');

const sync = dynamoSync({
  tableName: process.env.CONNECTIONS_TABLE,
  sync: true,
});

console.log('dynamo', dynamo);

const websocket = async (event) => {
  console.log('Event', JSON.stringify(event, null, 2));
  const { requestContext } = event;

  const context = await sync(requestContext);
  switch(requestContext.eventType) {
    case 'MESSAGE': {
      const send = createPublisher(context, { port: 443, dry: true });
      await send('hi');
      break;
    }
  }
  return {
    statusCode: '200',
  }
}

module.exports = { 
  default: websocket,
};