// eslint-disable-next-line import/no-unresolved
const AWS = require('aws-sdk');

const doc = new AWS.DynamoDB.DocumentClient();

const DEFAULT_OPTIONS = {
  tableName: '',
  sync: false,
};

const createRequest = ({
  tableName, connectionId, domainName, stage,
}, additional = {}) => ({
  TableName: tableName,
  Item: {
    ...additional,
    connectionId,
    domainName,
    stage,
  },
});

const baseRequest = ({ tableName, connectionId }) => ({
  TableName: tableName,
  Key: { connectionId },
});

module.exports = (opts = DEFAULT_OPTIONS) => async (requestContext, addtionalFields = {}) => {
  const options = { ...DEFAULT_OPTIONS, ...opts };
  if (!options || !options.tableName) {
    throw new Error('Must provide a tableName to sync clients with');
  }

  if (!options.sync) {
    return requestContext;
  }

  const mergedRequest = { ...requestContext, ...options };
  switch (mergedRequest.eventType) {
    case 'CONNECT': {
      const request = createRequest(mergedRequest, addtionalFields);
      await doc.put(request).promise();
      break;
    }
    case 'DISCONNECT': {
      const request = baseRequest(mergedRequest);
      await doc.delete(request).promise();
      break;
    }
    case 'MESSAGE': {
      const request = baseRequest(mergedRequest);
      const restored = await doc.get(request).promise();
      return restored && restored.Item
        ? restored.Item
        : requestContext;
    }
    default: {
      break;
    }
  }

  return requestContext;
};
