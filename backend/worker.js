const { statuses } = require('./constants/statuses');
const answerModel = require('./answers/answer.model');

module.exports.processAnswer = async (event, context) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const body = JSON.parse(event.body);
  await answerModel.addAttempt(body.id);

  try {
    await answerModel.update(body.id, {
      answer: body.answer,
      answerStatus: statuses.processed,
      errorMessage: null,
    });
  } catch (error) {
    console.error(error);
    await answerModel.updateErrorMessage(body.id, error.message);
  }
};
