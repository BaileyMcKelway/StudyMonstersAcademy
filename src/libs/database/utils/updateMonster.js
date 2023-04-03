const { Monster } = require('../models');
const logger = require('../../logger');

module.exports = async ({
  user,
  exp,
  level,
  hasLeveledUp,
  newKnowledge,
  newMetaData,
}) => {
  logger.info(`Updating monster [user_id=${user.id}]`);
  try {
    const metadata = JSON.stringify(newMetaData);
    await Monster.update(
      {
        experience: exp,
        level: hasLeveledUp ? level + 1 : level,
        knowledge: newKnowledge,
        metadata,
      },
      { where: { user_id: user.id } }
    );

    return;
  } catch (e) {
    console.log(e);
  }
};
