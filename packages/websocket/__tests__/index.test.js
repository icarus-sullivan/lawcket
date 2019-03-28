const lawcket = require('../');

const buildEvent = (event) => ({
  requestContext: {
    eventType: event,
    stage: 'dev',
    domainName: 'fakeDomain.execute-api.us-west-2.amazonaws.com',
    connectionId: 'fake-id',
  },
  body: '',
});

describe('@lawcket/websocket', () => {

  describe('base', () => {
    test('connect', async () => {
      const handler = jest.fn();
      const response = await lawcket(handler)(buildEvent('CONNECT'));
      expect(handler).toHaveBeenCalled();
      expect(handler.mock.calls[0][1]).toHaveProperty('event', 'connect');
      expect(response).toEqual({
        statusCode: '200',
      });
    });

    test('close', async () => {
      const handler = jest.fn();
      const response = await lawcket(handler)(buildEvent('DISCONNECT'));
      expect(handler).toHaveBeenCalled();
      expect(handler.mock.calls[0][1]).toHaveProperty('event', 'close');
      expect(handler.mock.calls[0][2]).not.toBeDefined();
      expect(response).toEqual({
        statusCode: '200',
      });
    });

    test('message', async () => {
      const handler = jest.fn();
      const response = await lawcket(handler)(buildEvent('MESSAGE'));
      expect(handler).toHaveBeenCalled();
      expect(handler.mock.calls[0][1]).toHaveProperty('event', 'message');
      expect(handler.mock.calls[0][2]).toBeDefined();
      expect(response).toEqual({
        statusCode: '200',
      });
    });
  });

  test('plugins are broadcasted to', async () => {
    const fakePlugin = jest.fn();
    const plugins = [fakePlugin];
    const handler = jest.fn();
    const response = await lawcket(handler, { plugins })(buildEvent('MESSAGE'));
    expect(fakePlugin.mock.calls[0]).toEqual(handler.mock.calls[0]);
    expect(response).toEqual({
      statusCode: '200',
    });
  });

  test('middleware is called', async () => {
    const middle = jest.fn((event) => ({
      ...event,
      injected: true,
    }))
    const middleware = [ middle ];

    const handler = jest.fn();
    const response = await lawcket(handler, { middleware })(buildEvent('MESSAGE'));

    expect(middle).toHaveBeenCalled();
    expect(handler).toHaveBeenCalled();
    expect(handler.mock.calls[0][0]).toHaveProperty('injected', true);
    expect(response).toEqual({
      statusCode: '200',
    });
  });

  test('middleware fails, entire function fails', async () => {
    expect.assertions(3);
    const middle = jest.fn((event) => {
      throw new Error('no');
    })
    const middleware = [ middle ];

    const handler = jest.fn();
    try {
      await lawcket(handler, { middleware })(buildEvent('MESSAGE'));
    } catch (e) {
      expect(middle).toHaveBeenCalled();
      expect(handler).not.toHaveBeenCalled();
      expect(e.message).toEqual('no');
    }
  });

});