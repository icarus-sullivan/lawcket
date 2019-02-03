const createDynamo = require('lws/packages/dynamo');
const createPublisher = require('lws/packages/publisher');

const dynamo = createDynamo({
  tableName: process.env.CONNECTIONS_TABLE,
  sync: true,
});

const websocket = async (event) => {
  console.log('Event', JSON.stringify(event, null, 2));
  const { requestContext } = event;

  const context = await dynamo(requestContext);
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