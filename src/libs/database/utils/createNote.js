const { Notes } = require('../models');
const logger = require('../../logger');

module.exports = async ({ user, text, subject, ideas, quality, category }) => {
  logger.info(`Creating note [user_id=${user.id}]`);
  try {
    const note = await new Notes({
      user_id: user.id,
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
