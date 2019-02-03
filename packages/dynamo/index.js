const AWS = require('aws-sdk');
const doc = new AWS.DynamoDB.DocumentClient();

const DEFAULT_OPTIONS = {
  tableName: '',
  sync: false,
  dry: false,
};

const createRequest = ({ tableName, connectionId, domainName, stage }) => ({
  TableName: tableName,
  Item: {
    connectionId,
    domainName,
    stage,
  },
});

const baseRequest = ({ tableName, connectionId }) => ({ 
  TableName: tableName, 
  Key: { connectionId } 
});

module.exports = (opts = DEFAULT_OPTIONS) => async (requestContext) => {
  const options = { ...DEFAULT_OPTIONS, ...opts };
  if (!options || !options.tableName) {
    throw new Error('Must provide a tableName to sync clients with');
  }

  if (!options.sync) {
    return requestContext;
  }

  const { tableName } = options;
  const mergedRequest = { ...requestContext, tableName };
  switch(mergedRequest.eventType) {
    case 'CONNECT': {
      const request = createRequest(mergedRequest);
      if (options.dry) {
        console.log('Adding connection', request);
        break;
      }
      console.log(doc.put);
      await doc.put(request).promise();
      break;
    }
    case 'DISCONNECT': {
      const request = baseRequest(mergedRequest);
      if (options.dry) {
        console.log('Removing connection', request);
        break;
      }
      await doc.delete(request).promise();
      break;
    }
    case 'MESSAGE': {
      const request = baseRequest(mergedRequest);
      if (options.dry) {
        console.log('Restoring connection', request);
        break;
      }
      const restored = await doc.get(request).promise();
      return restored && restored.Item 
        ? restored.Item 
        : requestContext;
    }
  }

  return requestContext;
};