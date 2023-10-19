import models from '../models';
import logger from '../../logger';
import { TYPE } from '../../global';

export default async ({ user }) => {
  logger.info(`Getting monster [user_id=${user.id} type=${TYPE}]`);
  try {
    const monster = await models.Monster.findOne({
      where: { user_id_and_type: user.id + TYPE },
    });

    return monster?.dataValues;
  } catch (e) {
    logger.info(
      `Create monster failiure: [user_id=${user.id} type=${TYPE} error: ${e}]`
    );
  }
};
