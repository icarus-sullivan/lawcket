const AWS = require('aws-sdk');
const { curry, pipe } = require('./utils');

const doc = new AWS.DynamoDB.DocumentClient();

const DEFAULT_OPTIONS = {
  sync: false,
};

const doOperation = curry((tableName, fn, request) => fn({ 
  TableName: tableName,
  ...request,
}).promise());

const makeSyncParams = ({ connectionId, domainName, stage }) => ({ 
  Item: { connectionId, domainName, stage }
});

const makeKeyParams = ({ connectionId }) => ({ Key: connectionId });

const inflateRestoredItem = (response) => {
  if (response && response.Item) {
    return response.Item;
  }
  throw new Error('Unabled to retrieve stored connection');
};

const createDynamo = (opts = DEFAULT_OPTIONS) => (requestContext) => {
  const merged = { ...DEFAULT_OPTIONS, ...opts };
  if (!merged || !merged.tableName) {
    throw new Error('Must provide a tableName to sync clients with');
  }

  if (!merged.sync) {
    return requestContext;
  }

  switch(eventType) {
    case 'CONNECT': {
      return pipe(makeSyncParams, doOperation(tableName, doc.put))(requestContext);
    }
    case 'DISCONNECT': {
      return pipe(makeKeyParams, doOperation(tableName, doc.delete))(requestContext);
    }
    case 'MESSAGE': {
      return pipe(makeKeyParams, doOperation(tableName, doc.get, inflateRestoredItem))(requestContext);
    }
  }

  return requestContext;
};

module.exports = createDynamo;