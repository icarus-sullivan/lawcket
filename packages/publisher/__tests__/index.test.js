// eslint-disable-next-line import/no-unresolved
const { sign } = require('aws4');
const { request } = require('http');
const { request: secureRequest } = require('https');
const createPublisher = require('../');

jest.mock('aws4');
jest.mock('http');
jest.mock('https');

const fakeEvent = {
  requestContext: {
    routeKey: '$default',
    authorizer: '',
    messageId: 'UgfzGcrpvHcCJyg=',
    integrationLatency: '',
    eventType: 'MESSAGE',
    error: '',
    extendedRequestId: 'UgfzGG6RvHcF8GA=',
    requestTime: '03/Feb/2019:05:18:37 +0000',
    messageDirection: 'IN',
    stage: 'dev',
    requestId: 'UgfzGG6RvHcF8GA=',
    domainName: '70xqba8pp4.execute-api.us-west-2.amazonaws.com',
    connectionId: 'UgfywcrkvHcCJyg=',
    apiId: '70xqba8pp4',
    status: '',
  },
};

const mockReq = (fn) => fn.mockImplementation((p, cb) => {
  cb({ statusCode: 200 });
  return {
    write: jest.fn(),
    on: jest.fn(),
    end: jest.fn(),
  };
});

beforeEach(() => {
  jest.resetAllMocks();
  sign.mockImplementation((args) => args);
});

test('http', async () => {
  mockReq(request);
  const send = createPublisher(fakeEvent, { secure: false });
  await send('hi');
  expect(request.mock.calls[0][0]).toMatchSnapshot();
});

test('https', async () => {
  mockReq(secureRequest);
  const send = createPublisher(fakeEvent, { secure: true });
  await send('hi');
  expect(secureRequest.mock.calls[0][0]).toMatchSnapshot();
});

test('buffer data', async () => {
  mockReq(secureRequest);
  const send = createPublisher(fakeEvent, { secure: true });
  const buf = Buffer.from([0x88, 0x02]);
  await send(buf);
  expect(secureRequest.mock.calls[0][0]).toMatchSnapshot();
});
