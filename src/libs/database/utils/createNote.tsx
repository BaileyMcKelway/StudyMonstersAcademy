import models from '../models';
import logger from '../../logger';
import { TYPE } from '../../global';

export default async ({ user, text, subject, ideas, quality, category }) => {
  logger.info(`Creating note [user_id=${user.id} type=${TYPE}]`);
  try {
    const userIdAndType = user.id + TYPE;
    subject = subject.replace(',', '');
    const note = await new models.Notes({
      user_id_and_type: userIdAndType,
      text,
      subject,
      ideas,
      quality,
      category,
    }).save();

    return note;
  } catch (e) {
    logger.info(
      `Create note failiure: [user_id=${user.id} type=${TYPE} error: ${e}]`
    );
    console.log(e);
  }
};
