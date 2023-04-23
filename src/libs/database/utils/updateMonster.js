const { Monster } = require('../models');
const logger = require('../../logger');
const { TYPE } = require('../../global');

module.exports = async ({
  user,
  exp,
  level,
  hasLeveledUp,
  newKnowledge,
  newMetaData,
}) => {
  logger.info(`Updating monster [user_id=${user.id} type=${TYPE}]`);
  try {
    const userIdAndType = user.id + TYPE;
    const metadata = JSON.stringify(newMetaData);
    await Monster.update(
      {
        experience: exp,
        level: hasLeveledUp ? level + 1 : level,
        knowledge: newKnowledge,
        metadata,
      },
      { where: { user_id_and_type: userIdAndType } }
    );

    return;
  } catch (e) {
    logger.info(
      `Updating monster [user_id=${user.id} type=${TYPE} error:${e}]`
    );
    console.log(e);
  }
};
