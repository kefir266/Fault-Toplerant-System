const AWS = require('aws-sdk');
const { WEBSOCKET_CONNECTION_TABLE, WEBSOCKET_API_ENDPOINT } = process.env;

module.exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const db = new AWS.DynamoDB.DocumentClient();
  const connections = await db
    .scan({
      TableName: WEBSOCKET_CONNECTION_TABLE,
    })
    .promise();

  const records = event.Records || [];
  for (const record of records) {
    if (
      record.eventName === 'INSERT' ||
      record.eventName === 'REMOVE' ||
      record.eventName === 'MODIFY'
    ) {
      await broadcastToSSocket(record);
    }
  }

  return {
    statusCode: 200,
    body: 'Broadcast completed',
  };

  function broadcastToSSocket(data) {
    const api = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: WEBSOCKET_API_ENDPOINT,
    });

    return Promise.allSettled(
      connections.Items.map((connection) => {
        return api
          .postToConnection({
            ConnectionId: connection.connectionId,
            Data: JSON.stringify(data),
          })
          .promise();
      }),
    );
  }
};
