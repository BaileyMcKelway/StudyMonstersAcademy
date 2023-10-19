import models from '../models';
import logger from '../../logger';
import { TYPE } from '../../global';

export default async (e: { id: string }) => {
  logger.info(`Getting essay [user_id=${e.id} type=${TYPE}]`);
  try {
    const userIdAndType = e.id + TYPE;
    const essays = await models.Essays.findAll({
      where: { user_id_and_type: userIdAndType },
    });

    return essays;
  } catch (error) {
    logger.info(
      `Get essay failiure: [user_id=${e.id} type=${TYPE} error: ${error}]`
    );
    console.log(e);
  }
};
