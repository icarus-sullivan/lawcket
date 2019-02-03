const aws4 = require('aws4');
const https = require('https');
const http = require('http');
const request = require('./request'); 

const DEFAULT_OPTIONS = {
  port: 443,
  dry: false,
};

const assumeHeaders = (data) => 
  data && data instanceof Buffer 
    ? { 'Content-Type': 'application/octet-stream' }
    : { 'Content-Type': 'application/json' };

const assumeBody = (data) => 
  data && data instanceof Buffer 
    ? data
    : JSON.stringify(data);

const createPublisher = ({ requestContext }, opts = DEFAULT_OPTIONS) => (data) => {
  const { domainName, connectionId, stage } = requestContext;
  const signedRequest = aws4.sign({
    path: `/${stage}/%40connections/${encodeURIComponent(connectionId)}`,
    headers: assumeHeaders(data),
    body: assumeBody(data),
    host: domainName,
    method: 'POST',
  });

  if (opts.dry) {
    console.log(`Requesting on port ${opts.port}`, JSON.stringify(signedRequest, null, 2));
    return;
  }

  const method = opts.port === 443 ? https : http;
  return request(method, signedRequest);
};

module.exports = createPublisher;