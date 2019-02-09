const publishMiddleware = require('../');

const fakeRequest = {
  eventType: 'MESSAGE',
  stage: 'unit',
  domainName: 'test.execute-api.us-west-2.amazonaws.com',
  connectionId: 'testId',
};

const makeEvent = (eventType) => ({
  requestContext: {
    ...fakeRequest,
    eventType,
  },
});

beforeEach(() => {
  jest.resetAllMocks();
});

test('CONNECT', async () => {
  const event = makeEvent('CONNECT');
  expect(publishMiddleware(event)).not.toHaveProperty('send');
});

test('DISCONNECT', async () => {
  const event = makeEvent('DISCONNECT');
  expect(publishMiddleware(event)).not.toHaveProperty('send');
});

test('MESSAGE', async () => {
  const event = makeEvent('MESSAGE');
  expect(publishMiddleware(event)).toHaveProperty('send');
});
