const { sign } = require('aws4');
const http = require('http');
const https = require('https');
const request = require('../request');
const createPublisher = require('../');

jest.mock('aws4');
jest.mock('../request');

const fakeEvent = {
  "requestContext": { 
    "routeKey": "$default", 
    "authorizer": "", 
    "messageId": "UgfzGcrpvHcCJyg=", 
    "integrationLatency": "", 
    "eventType": "MESSAGE", 
    "error": "", 
    "extendedRequestId": "UgfzGG6RvHcF8GA=", 
    "requestTime": "03/Feb/2019:05:18:37 +0000", 
    "messageDirection": "IN", 
    "stage": "dev", 
    "requestId": "UgfzGG6RvHcF8GA=", 
    "domainName": "70xqba8pp4.execute-api.us-west-2.amazonaws.com", 
    "connectionId": "UgfywcrkvHcCJyg=", 
    "apiId": "70xqba8pp4", "status": "" 
  }
};

beforeEach(() => {
  jest.resetAllMocks();
  sign.mockImplementation((args) => args);
  request.mockImplementation((method, args) => args);
});

test('dry run', async () => {
  const send = createPublisher(fakeEvent, { dry: true, port: 80 });
  
  await send('hi');

  expect(request).not.toHaveBeenCalled();
  expect(sign).toHaveBeenCalled();
});

test('port 80', async () => {
  const send = createPublisher(fakeEvent, { port: 80 });
  await send('hi');
  expect(request.mock.calls[0][0]).toEqual(http);
});

test('port 443', async () => {
  const send = createPublisher(fakeEvent, { port: 443 });
  await send('hi');
  expect(request.mock.calls[0][0]).toEqual(https);
});

test('buffer data', async () => {
  const send = createPublisher(fakeEvent, { port: 443 });
  const buf = new Buffer([0x88, 0x02]);
  await send(buf);
  expect(sign.mock.calls[0][0]).toHaveProperty('data', buf);
})