import models from '../models';
import logger from '../../logger';
import { TYPE } from '../../global';
import { Op } from 'sequelize';

export default async (user, noteIds) => {
  logger.info(`Deleting notes [user_id=${user.id} type=${TYPE}]`);

  try {
    const userIdAndType = user.id + TYPE;
    const notes = await models.Notes.destroy({
      where: {
        user_id_and_type: userIdAndType,
        id: { [Op.in]: noteIds },
      },
    });

    return notes;
  } catch (e) {
    logger.info(
      `Delete Notes failiure: [user_id=${user.id} type=${TYPE} error: ${e}]`
    );
    console.log(e);
  }
};
