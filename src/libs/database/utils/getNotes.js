const { Notes } = require('../models');
const { Op } = require('sequelize');
const logger = require('../../logger');

module.exports = async (user, noteTitles) => {
  logger.info(`Getting notes [user_id=${user.id}]`);
  if (!noteTitles) {
    try {
      const notes = await Notes.findAll({
        where: { user_id: user.id },
      });

      return notes;
    } catch (e) {
      console.log(e);
    }
  } else if (user && noteTitles) {
    try {
      const notes = await Notes.findAll({
        where: {
          user_id: user.id,
          subject: { [Op.in]: noteTitles },
        },
      });

      return notes;
    } catch (e) {
      console.log(e);
    }
  }
};
