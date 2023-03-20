const { Notes } = require('../models');
const { Op } = require('sequelize');
const logger = require('../../logger');

module.exports = async (user, noteIds) => {
  logger.info(`Deleting notes [user_id=${user.id}]`);

  try {
    const notes = await Notes.destroy({
      where: {
        user_id: user.id,
        id: { [Op.in]: noteIds },
      },
    });

    return notes;
  } catch (e) {
    console.log(e);
  }
};
