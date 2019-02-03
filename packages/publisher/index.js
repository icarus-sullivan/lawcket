const aws4 = require('aws4')
const https = require('https')
const http = require('http')

const BINARY_HEADERS = {
  'Content-Type': 'application/octet-stream',
};

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};  

const DEFAULT_OPTIONS = {
  port: 443,
  dry: false,
};

const isBuffer = (data) => data && data instanceof Buffer;

const request = (method, options) => new Promise((resolve, reject) => {
  const { body } = options;
  const req = method.request(options, ({ statusCode }) => {
    statusCode === 200
      ? resolve()
      : reject(`Request failed with status ${statusCode}`);
  })
  req.on('error', reject);
  req.write(body);
  req.end();
});

const createPublisher = ({ requestContext }, opts = DEFAULT_OPTIONS) => (data) => {
  const { domainName, connectionId, stage } = requestContext;
  const buffer = isBuffer(data);
  const signedRequest = aws4.sign({
    path: `/${stage}/%40connections/${encodeURIComponent(connectionId)}`,
    host: domainName,
    method: 'POST',
    headers: buffer ? BINARY_HEADERS : DEFAULT_HEADERS,
    data: buffer ? data : JSON.stringify(data),
  });

  if (opts.dry) {
    console.log(`Requesting on port ${opts.port}`, JSON.stringify(signedRequest, null, 2));
    return;
  }

  const method = port === 433 ? https : http;
  return request(method, signedRequest);
};

module.exports = createPublisher;