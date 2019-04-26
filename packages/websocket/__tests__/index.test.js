const lawcket = require('../');

const framework = ({ middleware, plugins, handler, event }) => 
  lawcket({ middleware, plugins, handler })({
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
      const response = await framework({ handler, event: 'CONNECT' });
      expect(handler).toHaveBeenCalled();
      expect(handler.mock.calls[0][1]).toMatchSnapshot();
      // publish method not present
      expect(handler.mock.calls[0][2]).toBeUndefined();
      expect(response).toEqual({
        statusCode: '200',
      });
    });

    test('close', async () => {
      const handler = jest.fn();
      const response = await framework({ handler, event: 'DISCONNECT' });
      expect(handler).toHaveBeenCalled();
      expect(handler.mock.calls[0][1]).toMatchSnapshot();
      // publish method not present
      expect(handler.mock.calls[0][2]).toBeUndefined();
      expect(response).toEqual({
        statusCode: '200',
      });
    });

    test('message', async () => {
      const handler = jest.fn();
      const response = await framework({ handler, event: 'MESSAGE' });
      expect(handler).toHaveBeenCalled();
      expect(handler.mock.calls[0][1]).toMatchSnapshot();
      expect(handler.mock.calls[0][2]).toBeDefined();
      expect(response).toEqual({
        statusCode: '200',
      });
    });
  });

  test('plugins are broadcasted to', async () => {
    const args = {
      handler: jest.fn(),
      plugins: [jest.fn()],
      event: 'MESSAGE',
    };
    await framework(args);
    // plugins get the same event as the handler
    expect(args.handler.mock.calls[0]).toEqual(args.plugins[0].mock.calls[0]);
  });

  test('middleware is called', async () => {
    const args = {
      handler: jest.fn(),
      middleware: [
        jest.fn((ev) => ({
          ...ev,
          injected: true,
        }))
      ],
      event: 'MESSAGE',
    };
    await framework(args);

    expect(args.middleware[0]).toHaveBeenCalled();
    expect(args.handler).toHaveBeenCalled();
    expect(args.handler.mock.calls[0][0]).toHaveProperty('injected', true);
  });

  test('middleware fails, entire function fails', async () => {
    expect.assertions(3);
    const args = {
      handler: jest.fn(),
      middleware: [
        jest.fn(() => {
          throw new Error('no');
        })
      ],
      event: 'MESSAGE',
    };

    try {
      await framework(args);
    } catch (e) {
      expect(args.middleware[0]).toHaveBeenCalled();
      expect(args.handler).not.toHaveBeenCalled();
      expect(e.message).toEqual('no');
    }
  });

});