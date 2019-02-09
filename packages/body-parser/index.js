
const deserializeBody = ({ isBase64Encoded, body = '{}' }) => {
  try {
    const debuff = Buffer.from(body, isBase64Encoded ? 'base64' : undefined);
    const o = JSON.parse(debuff);
    if (o && typeof o === 'object') {
      return o;
    }
  } catch (e) {
    // do nothing
  }
  return body;
};

module.exports = (event) => ({
  ...event,
  body: deserializeBody(event),
});
