import models from '../models';
import logger from '../../logger';
import { TYPE } from '../../global';

export default async ({
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
    await models.Monster.update(
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
