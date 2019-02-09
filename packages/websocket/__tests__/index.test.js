const LambdaWebSocket = require('../');

const buildEvent = (event) => ({
  requestContext: {
    eventType: event,
    stage: 'dev',
    domainName: 'fakeDomain.execute-api.us-west-2.amazonaws.com',
    connectionId: 'fake-id',
  },
  body: '',
});

describe('base', () => {
  test('connect', async () => {
    const handler = jest.fn();

    const event = buildEvent('CONNECT');
    const socket = new LambdaWebSocket();
    socket.on('connect', handler);
    await socket.createHandler()(event);
    expect(handler).toHaveBeenCalled();
  });

  test('close', async () => {
    const handler = jest.fn();

    const event = buildEvent('DISCONNECT');
    const socket = new LambdaWebSocket();
    socket.on('close', handler);
    await socket.createHandler()(event);
    expect(handler).toHaveBeenCalled();
  });

  test('message', async () => {
    const handler = jest.fn();

    const event = buildEvent('MESSAGE');
    const socket = new LambdaWebSocket();
    socket.on('message', handler);
    await socket.createHandler()(event);
    expect(handler).toHaveBeenCalled();
  });
});

describe('plugins', () => {
  class Plugin {
    constructor() {
      this.close = jest.fn();
      this.message = jest.fn();
      this.connect = jest.fn();
    }
  }

  test('connect', async () => {
    const plugin = new Plugin();
    const event = buildEvent('CONNECT');
    const socket = new LambdaWebSocket({
      plugins: [plugin],
    });

    await socket.createHandler()(event);
    expect(plugin.connect).toHaveBeenCalled();
  });

  test('close', async () => {
    const plugin = new Plugin();
    const event = buildEvent('DISCONNECT');
    const socket = new LambdaWebSocket({
      plugins: [plugin],
    });

    await socket.createHandler()(event);
    expect(plugin.close).toHaveBeenCalled();
  });

  test('message', async () => {
    const plugin = new Plugin();
    const event = buildEvent('MESSAGE');
    const socket = new LambdaWebSocket({
      plugins: [plugin],
    });

    await socket.createHandler()(event);
    expect(plugin.message).toHaveBeenCalled();
  });
});


describe('middleware', () => {
  test('connect', async () => {
    const middleware = jest.fn((e) => e);
    const event = buildEvent('CONNECT');
    const socket = new LambdaWebSocket({
      middleware: [middleware],
    });

    await socket.createHandler()(event);
    expect(middleware).toHaveBeenCalledWith(event);
  });

  test('close', async () => {
    const middleware = jest.fn((e) => e);
    const event = buildEvent('DISCONNECT');
    const socket = new LambdaWebSocket({
      middleware: [middleware],
    });

    await socket.createHandler()(event);
    expect(middleware).toHaveBeenCalledWith(event);
  });

  test('message', async () => {
    const middleware = jest.fn((e) => e);
    const event = buildEvent('MESSAGE');
    const socket = new LambdaWebSocket({
      middleware: [middleware],
    });

    await socket.createHandler()(event);
    expect(middleware).toHaveBeenCalledWith(event);
  });
});
