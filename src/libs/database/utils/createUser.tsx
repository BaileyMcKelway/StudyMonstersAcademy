import models from '../models';
import logger from '../../logger';
import { TYPE } from '../../global';

export default async ({ user }) => {
  logger.info(`Creating user [user_id=${user.id} type=${TYPE}]`);
  try {
    const userIdAndType = user.id + TYPE;
    await new models.User({
      user_id: user.id,
      user_id_and_type: userIdAndType,
    }).save();

    const monster = await new models.Monster({
      user_id_and_type: userIdAndType,
      type: TYPE,
    }).save();

    await new models.Notes({
      user_id_and_type: userIdAndType,
      text: 'Monster Academy is the most prestigious and only academy in all of Monster Town. It is my dream to attend Monster Academy! I plan on writing essays until I get in!',
      subject: 'Monster Academy',
      ideas:
        'Monster Academy is the most prestitguous and only academy in all of Monster Town.$$It is my dream to attend Monster Academy! ',
      quality: 100,
      category: 'Education And Pedagogy',
    }).save();

    await new models.Notes({
      user_id_and_type: userIdAndType,
      text: 'My name is Banana, and I am a monster who lives in Monster Town. I am 450 monster years old. My favorite thing to do, other than write essays, is roller skate! I love learning and want to study everything!',
      subject: 'Banana',
      ideas:
        'My name is Banana, and I am a monster who lives in Monster Town.$$I love learning and want to study everything!',
      quality: 100,
      category: 'Celebrities And People',
    }).save();

    return monster;
  } catch (e) {
    logger.info(
      `Create user failiure: [user_id=${user.id} type=${TYPE} error: ${e}]`
    );
    console.log(e);
  }
};
