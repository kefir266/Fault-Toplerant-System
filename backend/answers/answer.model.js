const AWS = require('aws-sdk');
const { statuses } = require('../constants/statuses');
const { ANSWERS_TABLE, QUEUE_URL } = process.env;

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

function getById(id) {
  return dynamoDbClient
    .get({
      TableName: ANSWERS_TABLE,
      Key: {
        id: id,
      },
    })
    .promise();
}

function getAll() {
  return dynamoDbClient
    .scan({
      TableName: ANSWERS_TABLE,
      Limit: 100,
    })
    .promise()
    .then((data) =>
      data.Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    );
}

function create(item) {
  return dynamoDbClient
    .put({
      TableName: ANSWERS_TABLE,
      Item: item,
    })
    .promise();
}

function update(id, { answer, answerStatus, errorMessage }) {
  return dynamoDbClient
    .update({
      TableName: ANSWERS_TABLE,
      Key: {
        id: id,
      },
      UpdateExpression: `
      set answer = :answer, 
          errorMessage = :errorMessage,
          answerStatus = :answerStatus`,
      ExpressionAttributeValues: {
        ':answer': answer,
        ':answerStatus': answerStatus,
        ':errorMessage': errorMessage,
      },
      ReturnValues: 'ALL_NEW',
    })
    .promise();
}

function addAttempt(id) {
  return dynamoDbClient
    .update({
      TableName: ANSWERS_TABLE,
      Key: { id },
      UpdateExpression:
        'set attempt = if_not_exists(attempt, :start) + :inc, answerStatus = :answerStatus, errorMessage = :empty',
      ExpressionAttributeValues: {
        ':inc': 1,
        ':start': 0,
        ':answerStatus': statuses.pending,
        ':empty': '',
      },
    })
    .promise();
}

function updateErrorMessage(id, errorMessage) {
  return dynamoDbClient
    .update({
      TableName: ANSWERS_TABLE,
      Key: {
        id: id,
      },
      UpdateExpression:
        'set errorMessage = :errorMessage, answerStatus = :answerStatus',
      ExpressionAttributeValues: {
        ':errorMessage': errorMessage,
        ':answerStatus': statuses.failed,
      },
    })
    .promise();
}

module.exports = {
  getById,
  getAll,
  create,
  update,
  addAttempt,
  updateErrorMessage,
};
