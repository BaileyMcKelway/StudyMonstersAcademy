const { Notes } = require('../models');
const logger = require('../../logger');
const { TYPE } = require('../../global');

module.exports = async ({ user, text, subject, ideas, quality, category }) => {
  logger.info(`Creating note [user_id=${user.id} type=${TYPE}]`);
  try {
    const userIdAndType = user.id + TYPE;
    subject = subject.replace(',', '');
    const note = await new Notes({
      user_id_and_type: userIdAndType,
      text,
      subject,
      ideas,
      quality,
      category,
    }).save();

    return note;
  } catch (e) {
    console.log(e);
  }
};
