const AWS = require('aws-sdk');
const { WEBSOCKET_CONNECTION_TABLE } = process.env;
const db = new AWS.DynamoDB.DocumentClient();

async function connectionHandler(event) {
  await db
    .put({
      TableName: WEBSOCKET_CONNECTION_TABLE,
      Item: {
        connectionId: event.requestContext.connectionId,
        timestamp: Date.now(),
      },
    })
    .promise();

  return { statusCode: 200 };
}

async function disconnectionHandler(event) {
  await db
    .delete({
      TableName: WEBSOCKET_CONNECTION_TABLE,
      Key: { connectionId: event.requestContext.connectionId },
    })
    .promise();
  return { statusCode: 200 };
}

function defaultHandler() {
  return {
    statusCode: 200,
    body: 'Default handler response',
  };
}

module.exports = {
  connectionHandler,
  disconnectionHandler,
  defaultHandler,
};
