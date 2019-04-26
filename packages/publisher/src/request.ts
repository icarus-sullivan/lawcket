const https = require('https');

interface RequestOptions {
  path: string,
  headers: { [key: string]: any },
  body: any,
  host: string,
  method: string,
};

interface RequestResponse { statusCode: number };

export default (options: RequestOptions) => new Promise((resolve) => {
  const req = https.request(options, ({ statusCode }: RequestResponse) => {
    resolve(statusCode === 200);
  });
  req.on('error', () => resolve(false));
  req.write(options.body);
  req.end();
});