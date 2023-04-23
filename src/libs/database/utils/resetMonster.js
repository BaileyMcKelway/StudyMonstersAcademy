const { Monster, Notes, Essays } = require('../models');
const logger = require('../../logger');
const { TYPE } = require('../../global');

module.exports = async ({ user }) => {
  logger.info(`Reseting monster [user_id=${user.id} type=${TYPE}]`);
  try {
    const userIdAndType = user.id + TYPE;
    const metadata = JSON.stringify({});
    await Monster.update(
      {
        experience: 199,
        level: 1,
        knowledge: '',
        metadata,
      },
      { where: { user_id_and_type: userIdAndType } }
    );

    await Notes.destroy({
      where: {
        user_id_and_type: userIdAndType,
      },
    });

    await Essays.destroy({
      where: {
        user_id_and_type: userIdAndType,
      },
    });

    await new Notes({
      user_id_and_type: userIdAndType,
      text: 'Monster Academy is the most prestigious and only academy in all of Monster Town. It is my dream to attend Monster Academy! I plan on writing essays until I get in!',
      subject: 'Monster Academy',
      ideas:
        'Monster Academy is the most prestitguous and only academy in all of Monster Town.$$It is my dream to attend Monster Academy! ',
      quality: 100,
      category: 'Education And Pedagogy',
    }).save();

    await new Notes({
      user_id_and_type: userIdAndType,
      text: 'My name is Banana, and I am a monster who lives in Monster Town. I am 450 monster years old. My favorite thing to do, other than write essays, is roller skate! I love learning and want to study everything!',
      subject: 'Banana',
      ideas:
        'My name is Banana, and I am a monster who lives in Monster Town.$$I love learning and want to study everything!',
      quality: 100,
      category: 'Celebrities And People',
    }).save();

    return;
  } catch (e) {
    logger.info(
      `Resetting monster [user_id=${user.id} type=${TYPE} error:${e}]`
    );
    console.log(e);
  }
};
