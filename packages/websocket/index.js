const { pipe, broadcast } = require('@lawcket/fn');
const publisher = require('@lawcket/publisher');
const bodyParser = require('@lawcket/body-parser');

const EVENT_MAPPING = {
  CONNECT: 'connect',
  DISCONNECT: 'close',
  MESSAGE: 'message',
};

module.exports = (handler, { middleware = [], plugins = [] } = {}) => async (event) => {
  try {
    const evt = await pipe(bodyParser, ...middleware)(event);
    const publish = await publisher(evt);

    const { connectionId, domainName, stage, eventType } = evt.requestContext;
    const connection = {
      event: EVENT_MAPPING[eventType],
      connectionId,
      domainName,
      stage,
    }

    await broadcast(handler, ...plugins)(evt, connection, publish);
    return {
      statusCode: '200'
    };
  } catch (e) {
    throw e;
  }
}