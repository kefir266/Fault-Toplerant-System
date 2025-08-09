const AWS = require('aws-sdk');
const { WEBSOCKET_CONNECTION_TABLE, WEBSOCKET_API_ENDPOINT } = process.env;
console.log(WEBSOCKET_API_ENDPOINT);

module.exports.handler = async (event, context) => {
  console.log(event);

  const db = new AWS.DynamoDB.DocumentClient();
  const connections = await db
    .scan({
      TableName: WEBSOCKET_CONNECTION_TABLE,
    })
    .promise();

  const records = event.Records || [];
  for (const record of records) {
    if (record.eventName === 'INSERT' || record.eventName === 'REMOVE') {
      const sent = await broadcastToSSocket(record);
      console.log(sent);
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
    console.dir(connections);
    console.log(data);

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
