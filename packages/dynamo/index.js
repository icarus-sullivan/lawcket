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
    this.connect = this.connect.bind(this);
    this.close = this.close.bind(this);
  }

  async connect({ requestContext }) {
    const { tableName, additionalSyncFields } = this.options;
    const { connectionId, domainName, stage } = requestContext;
    console.log('doc.put', doc.put);
    return doc.put({
      TableName: tableName,
      Item: {
        ...additionalSyncFields,
        connectionId,
        domainName,
        stage,
      },
    }).promise();
  }

  async close({ requestContext }) {
    const { tableName } = this.options;
    const { connectionId } = requestContext;
    return doc.delete({
      TableName: tableName,
      Key: { connectionId },
    }).promise();
  }
}


module.exports = DynamoPlugin;
