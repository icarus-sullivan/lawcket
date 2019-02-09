
const EVENT_MAPPING = {
  CONNECT: 'connect',
  DISCONNECT: 'close',
  MESSAGE: 'message',
};

const DEFAULT_OPTIONS = {
  middleware: [],
  plugins: [],
};

const VALID_EVENTS = Object.values(EVENT_MAPPING);

const filterCbs = (m, ps) => ps.filter((p) => p[m]).map((p) => p[m]);

class LambdaWebSocket {
  constructor({ middleware, plugins } = DEFAULT_OPTIONS) {
    this.callbacks = {
      connect: filterCbs('connect', plugins),
      close: filterCbs('close', plugins),
      message: filterCbs('message', plugins),
    };

    this.middleware = middleware || [];
  }

  createHandler() {
    const socket = this;
    return async (event) => {
      const modifiedEvent = socket.middleware.reduce((a, m) => m(a), event);
      const type = modifiedEvent.requestContext.eventType;
      const callbacks = socket.callbacks[EVENT_MAPPING[type]];
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
