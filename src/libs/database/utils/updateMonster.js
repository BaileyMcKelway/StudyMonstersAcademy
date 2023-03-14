const { Monster } = require('../models');
const logger = require('../../logger');
const Sequelize = require('sequelize');

module.exports = async ({
  user,
  exp,
  level,
  hasLeveledUp,
  newKnowledge,
  skill,
}) => {
  logger.info(`Updating monster [user_id=${user.id}]`);
  try {
    if (hasLeveledUp) {
      await Monster.update(
        { experience: exp, level: level + 1, knowledge: newKnowledge },
        { where: { user_id: user.id } }
      );
    } else if (skill) {
      if (skill === 'memory') {
        await Monster.update(
          { memory: Sequelize.literal('memory + 1') },
          { where: { user_id: user.id } }
        );
      } else if (skill === 'comprehension') {
        await Monster.update(
          { comprehension: Sequelize.literal('comprehension + 1') },
          { where: { user_id: user.id } }
        );
      }
    } else {
      await Monster.update(
        { experience: exp, knowledge: newKnowledge },
        { where: { user_id: user.id } }
      );
    }

    return;
  } catch (e) {
    console.log(e);
  }
};
