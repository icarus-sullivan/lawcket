const aws4 = require('aws4');

interface SigningParams {
  stage: string,
  domainName: string,
  connectionId: string,
  data: any
};

const headers = (data: any) => 
  data && data instanceof Buffer 
    ? { 'Content-Type': 'application/octet-stream' }
    : { 'Content-Type': 'application/json' };

const body = (data: any) => 
  data && data instanceof Buffer
    ? data
    : JSON.stringify(data);

export default ({ data, stage, domainName, connectionId }: SigningParams) => aws4.sign({
  path: `/${stage}/%40connections/${encodeURIComponent(connectionId)}`,
  headers: headers(data),
  body: body(data),
  host: domainName,
  method: 'POST',
});