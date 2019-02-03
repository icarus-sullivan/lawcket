const createDynamo = require('lws/packages/dynamo');
const createPublisher = require('lws/packages/publisher');

const dynamo = createDynamo({
  tableName: process.env.CONNECTIONS_TABLE,
  dry: true,
});

const websocket = async (event) => {
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
  default: lws.createHandler(),
};