const { statuses } = require('./constants/statuses');
const answerModel = require('./answers/answer.model');

module.exports.processAnswer = async (event, context) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  console.log('Context:', JSON.stringify(context, null, 2));

  for (const record of event.Records) {
    const id = record.messageId;
    const body = JSON.parse(record.body);
    await answerModel.addAttempt(id);

    try {
      await answerModel.update(id, {
        answer: body.answer,
        answerStatus: statuses.processed,
        errorMessage: null,
      });
    } catch (error) {
      console.error(error);
      await answerModel.updateErrorMessage(id, error.message);
    }
  }
};
