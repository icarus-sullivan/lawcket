
const EVENT_MAPPING = {
  CONNECT: 'connect',
  DISCONNECT: 'close',
  MESSAGE: 'message',
};

const VALID_EVENTS = Object.values(EVENT_MAPPING);

const deserializeBody = ({ isBase64Encoded, body = '{}' }) => {
  try {
    const debuff = Buffer.from(body, isBase64Encoded ? 'base64' : undefined);
    const o = JSON.parse(debuff);
    if (o && typeof o === 'object') {
      return o;
    }
  } catch (e) {
    // do nothing
  }
  return body;
};

class LambdaWebSocket {
  constructor() {
    this.callbacks = {
      connect: [],
      close: [],
      message: [],
    };
  }

  createHandler() {
    const socket = this;
    return async ({
      headers, body, isBase64Encoded, requestContext,
    }) => {
      const type = requestContext.eventType;
      const cleanedRequest = {
        body: deserializeBody({ body, isBase64Encoded }),
        headers,
        requestContext,
      };

      const callbacks = socket.callbacks[EVENT_MAPPING[type]];
      await Promise.all(callbacks.map((fn) => fn(cleanedRequest)));

      return { statusCode: '200' };
    };
  }
}

LambdaWebSocket.prototype.on = function (name, fn) {
  if (!name || !fn) {
    throw new Error('event name or function undefined');
  }
  if (VALID_EVENTS.indexOf(name) === -1) {
    throw new Error(`${name} is an unsupported event name`);
  }
  this.callbacks[name].push(fn);
};

module.exports = LambdaWebSocket;
