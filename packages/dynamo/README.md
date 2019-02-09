# @lawcket/dynamo
![Downloads][link-download] ![Version][link-version] ![License][link-license]

#### @lawcket/websocket plugin: stores, syncs and releases websocket clients to dynamo

## Installation

```sh
npm install @lawcket/websocket @lawcket/dynamo
```
or
```sh
yarn add @lawcket/websocket @lawcket/dynamo
```

## Usage

Lambda websocket connections can sometimes be flakey. This can happen for a number of reasons, however there is a simple way to remediate any connection issues pertaining to these connection disruptions. Using a dynamo passthrough to sync connections can allow server-side code to store and mass-publish data to clients. 

```javascript
const DynamoPlugin = require('@lawcket/dynamo');
const LambdaWebSocket = require('@lawcket/websocket');

const dynamoPlugin = new DynamoPlugin({
  tableName: process.env.CONNECTIONS_TABLE,
  additionalSyncFields: {
    channel: '#general',
  },
});

const lambdaSocket = new LambdaWebSocket({
  plugins: [dynamoPlugin],
});

lambdaSocket.on('connect', async (event) => {
  // client is synced to dynamo
});

lambdaSocket.on('message', async (event) => {
  // no dynamo operations are done to avoid unwanted dynamo requests
});

lambdaSocket.on('close', async (event) => {
  // client has gone away, connection is removed the dynamo
});

module.exports = {
  default: lambdaSocket.createHandler(),
};
```

## Resources 
The table definition for the client is authoritarian only in respect to the primaryKey. Assuming you are using serverless for your table definition the base structure of it should follow the following example. 

```
resources:
  Resources:
    ConnectionsTable:
      Type: AWS::DynamoDB::Table
      Properties:
        BillingMode: PAY_PER_REQUEST
        TableName: SomeTableName-${self:provider.stage}
        AttributeDefinitions:
          - AttributeName: connectionId
            AttributeType: S
        KeySchema:
          - AttributeName: connectionId
            KeyType: HASH
```

*Note: The restrictions are only on the primary key, meaning your BillingMode, TableName or any additional indexes are not an issue. However the resource must contain the `connectionId` primary key.*

#### Caveats

The @lawcket/dynamo plugin is configured before connections are made, unfortunately that disallows dynamic fields from being entered during the sync process. To add extra fields the `additionalSyncFields` option is used to store other client-specific properties. 


[link-download]: https://img.shields.io/npm/dt/@lawcket/dynamo.svg
[link-version]: https://img.shields.io/npm/v/@lawcket/dynamo.svg
[link-license]: https://img.shields.io/npm/l/@lawcket/dynamo.svg