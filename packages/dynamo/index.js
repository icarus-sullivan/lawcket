const AWS = require('aws-sdk');
const doc = new AWS.DynamoDB.DocumentClient();

const DEFAULT_OPTIONS = {
  sync: false,
};

const createDynamo = (opts = DEFAULT_OPTIONS) => async (requestContext) => {
  const merged = { ...DEFAULT_OPTIONS, ...opts };
  if (!merged || !merged.tableName) {
    throw new Error('Must provide a tableName to sync clients with');
  }

  if (!merged.sync) {
    return requestContext;
  }

  const { tableName } = merged;
  const { connectionId, domainName, stage, eventType } = requestContext;
  switch(eventType) {
    case 'CONNECT': {
      await doc.put({ TableName: tableName, Item: { connectionId, domainName, stage } }).promise();
      return requestContext;
    }
    case 'DISCONNECT': {
      await doc.delete({ TableName: tableName, Key: connectionId }).promise();
      return requestContext;
    }
    case 'MESSAGE': {
      const restored = await doc.delete({ TableName: tableName, Key: connectionId }).promise();
      return restored && restored.Item 
        ? restored.Item 
        : requestContext;
    }
  }

  return requestContext;
};

module.exports = createDynamo;