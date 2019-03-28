
module.exports = ({ isBase64Encoded = false, body = '{}', ...rest }) => {
  try {
    const debuff = Buffer.from(body, isBase64Encoded ? 'base64' : undefined);
    const o = JSON.parse(debuff);
    if (o && typeof o === 'object') {
      return {
        ...rest,
        isBase64Encoded,
        body: o,
      }
    }
  } catch (e) {
    // do nothing
  }

  return {
    ...rest,
    isBase64Encoded,
    body,
  }
}
