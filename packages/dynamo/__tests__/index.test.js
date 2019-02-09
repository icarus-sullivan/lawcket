// eslint-disable-next-line import/no-unresolved
const DynamoPlugin = require('../');

test('no options', () => {
  expect.assertions(1);
  try {
    // eslint-disable-next-line no-new
    new DynamoPlugin();
  } catch (e) {
    expect(e.message).toEqual('Must provide a tableName to sync clients with');
  }
});
