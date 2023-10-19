import models from '../models';
import logger from '../../logger';
import { TYPE } from '../../global';

export default async ({ user, text, title, category }) => {
  logger.info(`Creating essay [user_id=${user.id}]`);
  try {
    const userIdAndType = user.id + TYPE;
    const essay = await new models.Essays({
      user_id_and_type: userIdAndType,
      text,
      title,
      category,
    }).save();

    return essay;
  } catch (e) {
    logger.info(
      `Create essay failiure: [user_id=${user.id} type=${TYPE} error: ${e}]`
    );
    console.log(e);
  }
};
