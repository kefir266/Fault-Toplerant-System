const AWS = require('aws-sdk');
const { statuses } = require('../constants/statuses');
const { getById, getAll, create, update } = require('../answers/answer.model');

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
        message: 'Answer not found',
      },
      404,
    );
  }

  return response({
    data: answer.Item,
  });
};

module.exports.postAnswer = async (event, context) => {
  const body = JSON.parse(event.body);

  const SQSRes = await sqs
    .sendMessage({
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify(body),
      MessageAttributes: {
        AttributeName: {
          StringValue: 'Attribute Value',
          DataType: 'String',
        },
      },
    })
    .promise();

  await create({
    id: SQSRes.MessageId,
    answer: body.answer,
    answerStatus: statuses.pending,
    attempt: 0,
    createdAt: new Date().toISOString(),
  });

  return response({
    message: 'Answer saved successfully',
    id: SQSRes.MessageId,
  });
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
