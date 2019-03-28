// eslint-disable-next-line import/no-unresolved
const aws4 = require('aws4');
const https = require('https');

const createHeaders = (data) => 
  data && data instanceof Buffer 
    ? { 'Content-Type': 'application/octet-stream' }
    : { 'Content-Type': 'application/json' };

const createBody = (data) => 
  data && data instanceof Buffer
    ? data
    : JSON.stringify(data);

const sign = ({ data, stage, domainName, connectionId }) => aws4.sign({
  path: `/${stage}/%40connections/${encodeURIComponent(connectionId)}`,
  headers: createHeaders(data),
  body: createBody(data),
  host: domainName,
  method: 'POST',
});

const createPublisher = ({ stage, domainName, connectionId }) => (data) => new Promise((resolve) => {
  const options = sign({ data, stage, domainName, connectionId });
  const req = https.request(options, ({ statusCode }) => {
    resolve(statusCode === 200);
  });
  req.on('error', () => resolve(false));
  req.write(options.body);
  req.end();
});

module.exports = ({ requestContext }) => 
  requestContext && requestContext.eventType === 'MESSAGE'
    ? createPublisher(requestContext)
    : undefined;
