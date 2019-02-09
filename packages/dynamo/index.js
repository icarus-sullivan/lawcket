// eslint-disable-next-line import/no-unresolved
const AWS = require('aws-sdk');

const doc = new AWS.DynamoDB.DocumentClient();

const DEFAULT_OPTIONS = {
  tableName: '',
  additionalSyncFields: {},
};

class DynamoPlugin {
  constructor(opts) {
    const options = { ...DEFAULT_OPTIONS, ...opts };
    if (!options || !options.tableName) {
      throw new Error('Must provide a tableName to sync clients with');
    }

    this.options = options;
  }

  async connect({ requestContext }) {
    const { connectionId, domainName, stage } = requestContext;
    return doc.put({
      TableName: this.options.tableName,
      Item: {
        ...this.options.additionalSyncFields,
        connectionId,
        domainName,
        stage,
      },
    }).promise();
  }

  async close({ requestContext }) {
    const { connectionId } = requestContext;
    return doc.delete({
      TableName: this.options.tableName,
      Key: { connectionId },
    }).promise();
  }
}


module.exports = DynamoPlugin;
