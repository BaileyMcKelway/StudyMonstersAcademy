const { Notes } = require('../models');
const { Op } = require('sequelize');
const logger = require('../../logger');

module.exports = async (user, noteTitles) => {
  logger.info(`Deleting notes [user_id=${user.id}]`);

  try {
    const notes = await Notes.destroy({
      where: {
        user_id: user.id,
        subject: { [Op.in]: noteTitles },
      },
    });

    return notes;
  } catch (e) {
    console.log(e);
  }
};
