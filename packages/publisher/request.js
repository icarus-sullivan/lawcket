
const request = (method, options) => new Promise((resolve, reject) => {
  const { body } = options;
  const req = method.request(options, ({ statusCode }) => {
    resolve(statusCode === 200);
  });
  req.on('error', () => resolve(false));
  req.write(body);
  req.end();
});

module.exports = request;