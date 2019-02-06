const LambdaWebSocket = require('../index');

const buildEvent = (event) => ({
  requestContext: {
    eventType: event,
    stage: 'dev',
    domainName: 'fakeDomain.execute-api.us-west-2.amazonaws.com',
    connectionId: 'fake-id',
  },
});

const buildInstance = (...callbacks) => {
  const socket = new LambdaWebSocket();
  callbacks.forEach(({ event, fn }) => socket.on(event, fn));
  return socket.createHandler();
};

test('connect', async () => {
  const connected = jest.fn();

  const handler = buildInstance({
    event: 'connect',
    fn: connected,
  });

  await handler(buildEvent('CONNECT'));
  expect(connected).toHaveBeenCalledWith({
    body: {},
    headers: undefined,
    requestContext: {
      connectionId: 'fake-id',
      domainName: 'fakeDomain.execute-api.us-west-2.amazonaws.com',
      eventType: 'CONNECT',
      stage: 'dev',
    },
  });
});
