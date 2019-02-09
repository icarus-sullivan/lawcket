const bodyParser = require('../');

const mockPayload = {
  foo: 'bar',
};

const mockBase64Event = {
  isBase64Encoded: true,
  body: Buffer.from(JSON.stringify(mockPayload)).toString('base64'),
};

const mockEvent = {
  body: JSON.stringify(mockPayload),
};

test('base64 decodes', () => {
  expect(bodyParser(mockBase64Event)).toHaveProperty('body', mockPayload);
});

test('stringified parse', () => {
  expect(bodyParser(mockEvent)).toHaveProperty('body', mockPayload);
});
