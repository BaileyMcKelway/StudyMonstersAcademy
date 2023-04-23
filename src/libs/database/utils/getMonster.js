const { Monster } = require('../models');
const logger = require('../../logger');
const { TYPE } = require('../../global');

module.exports = async ({ user }) => {
  logger.info(`Getting monster [user_id=${user.id} type=${TYPE}]`);
  try {
    const monster = await Monster.findOne({
      where: { user_id_and_type: user.id + TYPE },
    });

    return monster.dataValues;
  } catch (e) {
    logger.info(
      `Create monster failiure: [user_id=${user.id} type=${TYPE} error: ${e}]`
    );
  }
};
