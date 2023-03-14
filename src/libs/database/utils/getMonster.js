const { Monster } = require('../models');
const logger = require('../../logger');

module.exports = async (user) => {
  logger.info(`Getting monster [user_id=${user.id}]`);
  try {
    const monster = await Monster.findOne({
      where: { user_id: user.id },
    });

    return monster.dataValues;
  } catch (e) {
    console.log(e);
  }
};
