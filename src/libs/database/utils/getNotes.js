const { Notes } = require('../models');
const { Op } = require('sequelize');
const logger = require('../../logger');
const { TYPE } = require('../../global');

module.exports = async (user, noteTitles) => {
  logger.info(`Getting notes [user_id=${user.id} type=${TYPE}]`);
  const userIdAndType = user.id + TYPE;
  if (!noteTitles) {
    try {
      const notes = await Notes.findAll({
        where: { user_id_and_type: userIdAndType },
      });

      return notes;
    } catch (e) {
      console.log(e);
    }
  } else if (user && noteTitles) {
    try {
      const notes = await Notes.findAll({
        where: {
          user_id_and_type: userIdAndType,
          subject: { [Op.in]: noteTitles },
        },
      });

      return notes;
    } catch (e) {
      logger.info(
        `Get notes failiure: [user_id=${user.id} type=${TYPE} error: ${e}]`
      );
      console.log(e);
    }
  }
};
