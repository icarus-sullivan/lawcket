// eslint-disable-next-line import/no-unresolved
const aws4 = require('aws4');
const https = require('https');
const http = require('http');

const DEFAULT_OPTIONS = {
  secure: true,
};

const request = ({ method, options }) => new Promise((resolve) => {
  const { body } = options;
  const req = method.request(options, ({ statusCode }) => {
    resolve(statusCode === 200);
  });
  req.on('error', () => resolve(false));
  req.write(body);
  req.end();
});

const createRequest = (data, { stage, domainName, connectionId }) => aws4.sign({
  path: `/${stage}/%40connections/${encodeURIComponent(connectionId)}`,
  host: domainName,
  method: 'POST',
  headers: data && data instanceof Buffer
    ? { 'Content-Type': 'application/octet-stream' }
    : { 'Content-Type': 'application/json' },
  body: data && data instanceof Buffer
    ? data
    : JSON.stringify(data),
});

const createPublisher = ({ requestContext }, opts = DEFAULT_OPTIONS) => (data) => request({
  options: createRequest(data, requestContext),
  method: opts.secure ? https : http,
});

module.exports = (event) => ({
  ...event,
  send: createPublisher(event, { secure: true }),
});
