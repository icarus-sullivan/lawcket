const AWS = require('aws-sdk');
const { curry, pipe } = require('./utils');

const doc = new AWS.DynamoDB.DocumentClient();

const DEFAULT_OPTIONS = {
  dry: false,
};

const responseError = (msg) => { throw new Error(msg) };

// dynamo operations
const buildMethod = curry((tableName, fn, request) => fn({ 
  TableName: tableName,
  ...request,
}).promise());

const makeSyncParams = ({ connectionId, domainName, stage }) => ({ 
  Item: { connectionId, domainName, stage }
});

const makeKeyParams = ({ connectionId }) => ({ Key: connectionId });

const inflateRestoredItem = (response) => response && response.Item
  ? response.Item
  : responseError(`Unabled to retrieve connection`);

// configuration below this line
const mergeOptions = (opts = DEFAULT_OPTIONS) => ({ ...DEFAULT_OPTIONS, ...opts });

const validate = (merged) => merged.tableName 
  ? merged
  : responseError('Must provide a tableName to sync clients with');
  
const createDynamo = ({ tableName }) => ({
  sync: pipe(
    makeSyncParams,
    buildMethod(tableName, doc.put),
  ),
  restore: pipe(
    makeKeyParams, 
    buildMethod(tableName, doc.get),
    inflateRestoredItem,
  ),
  release: pipe(
    makeKeyParams,
    buildMethod(tableName, doc.delete),
  ),
});

const dynamo = pipe(
  mergeOptions,
  validate,
  createDynamo,
);

module.exports = dynamo;