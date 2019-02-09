
const EVENT_MAPPING = {
  CONNECT: 'connect',
  DISCONNECT: 'close',
  MESSAGE: 'message',
};

const VALID_EVENTS = Object.values(EVENT_MAPPING);

class LambdaWebSocket {
  constructor({ middleware, plugins }) {
    this.callbacks = {
      connect: [],
      close: [],
      message: [],
    };

    this.middleware = middleware || [];
    for (const plugin of plugins) {
      if (plugin.hasOwnProperty('close')) {
        this.callbacks.close.push(plugin.close);
      }
      if (plugin.hasOwnProperty('connect')) {
        this.callbacks.connect.push(plugin.connect);
      }
      if (plugin.hasOwnProperty('message')) {
        this.callbacks.message.push(plugin.message);
      }
    }
  }

  createHandler() {
    const socket = this;
    return async (event) => {
      const modifiedEvent = socket.middleware.reduce((a, m) => m(a), event);
      // {
      //   headers, body, isBase64Encoded, requestContext,
      // }
      // const type = requestContext.eventType;
      // const cleanedRequest = {
      //   body: deserializeBody({ body, isBase64Encoded }),
      //   headers,
      //   requestContext,
      // };

      // const callbacks = socket.callbacks[EVENT_MAPPING[type]];
      await Promise.all(callbacks.map((fn) => fn(modifiedEvent)));

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
