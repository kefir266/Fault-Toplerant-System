const AWS = require('aws-sdk');
const uuid = require('uuid');
const { statuses } = require('../constants/statuses');
const { getById, getAll, create } = require('../answers/answer.model');

const { QUEUE_URL } = process.env;

const sqs = new AWS.SQS();

module.exports.getAnswers = async (event, context) => {
  const answers = await getAll();

  return response({
    data: answers.Items,
  });
};

module.exports.getById = async (event, context) => {
  const { id } = event.pathParameters;

  const answer = await getById(id);

  if (!answer.Item) {
    return response(
      {
        message: 'IAnswer not found',
      },
      404,
    );
  }

  return response({
    data: answer.Item,
  });
};

module.exports.postAnswer = async (event, context) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  const body = event;
  const id = uuid.v4();

  await create({
    id,
    answer: body.answer,
    taskId: body.taskId,
    answerStatus: statuses.pending,
    attempt: 0,
    createdAt: new Date().toISOString(),
  });

  return response({ ...body, id });
};

function response(data, statusCode = 200) {
  if (statusCode >= 400) {
    console.error('Error response:', data.message);
  }
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // Adjust as needed for CORS
    },
    body: JSON.stringify(data, null, 2),
  };
}
