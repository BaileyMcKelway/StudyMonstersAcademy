const { Essays } = require('../models');
const logger = require('../../logger');
const { TYPE } = require('../../global');

module.exports = async ({ user, text, title, category }) => {
  logger.info(`Creating essay [user_id=${user.id}]`);
  try {
    const userIdAndType = user.id + TYPE;
    const essay = await new Essays({
      user_id_and_type: userIdAndType,
      text,
      title,
      category,
    }).save();

    return essay;
  } catch (e) {
    logger.info(
      `Create essay failiure: [user_id=${user.id} type=${TYPE} error: ${e}]`
    );
    console.log(e);
  }
};
