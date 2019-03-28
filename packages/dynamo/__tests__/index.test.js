// eslint-disable-next-line import/no-unresolved
const dynamoPlugin = require('../');

test('no options', async () => {
  expect.assertions(1);
  try {
    // eslint-disable-next-line no-new
    await dynamoPlugin({})({});
  } catch (e) {
    expect(e.message).toEqual('Must provide a tableName to sync clients with');
  }
});
