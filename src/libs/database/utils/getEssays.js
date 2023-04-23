const { Essays } = require('../models');
const logger = require('../../logger');
const { TYPE } = require('../../global');

module.exports = async (e) => {
  logger.info(`Getting essay [user_id=${e.id} type=${TYPE}]`);
  try {
    const userIdAndType = e.id + TYPE;
    const essays = await Essays.findAll({
      where: { user_id_and_type: userIdAndType },
    });

    return essays;
  } catch (e) {
    logger.info(
      `Get essay failiure: [user_id=${e.id} type=${TYPE} error: ${e}]`
    );
    console.log(e);
  }
};
