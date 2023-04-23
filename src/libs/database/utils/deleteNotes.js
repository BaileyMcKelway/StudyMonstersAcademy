const { Notes } = require('../models');
const { Op } = require('sequelize');
const logger = require('../../logger');
const { TYPE } = require('../../global');

module.exports = async (user, noteIds) => {
  logger.info(`Deleting notes [user_id=${user.id} type=${TYPE}]`);

  try {
    const userIdAndType = user.id + TYPE;
    const notes = await Notes.destroy({
      where: {
        user_id_and_type: userIdAndType,
        id: { [Op.in]: noteIds },
      },
    });

    return notes;
  } catch (e) {
    logger.info(
      `Delete Notes failiure: [user_id=${user.id} type=${TYPE} error: ${e}]`
    );
    console.log(e);
  }
};
