const { Essays } = require('../models');
const logger = require('../../logger');

module.exports = async (user, text) => {
  logger.info(`Creating note [user_id=${user.id}]`);
  try {
    const essay = await new Essays({
      user_id: user.id,
      text,
    }).save();

    return essay;
  } catch (e) {
    console.log(e);
  }
};
