const { Essays } = require('../models');
const logger = require('../../logger');

module.exports = async (e) => {
  logger.info(`Creating user [user_id=${e.id}]`);
  try {
    const essays = await Essays.findAll({
      where: { user_id: e.id },
    });

    return essays;
  } catch (e) {
    console.log(e);
  }
};
