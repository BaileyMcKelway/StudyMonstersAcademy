const { User, Monster, Notes } = require('../models');
const logger = require('../../logger');

module.exports = async (e) => {
  logger.info(`Creating user [user_id=${e.author.id}]`);
  try {
    await new User({
      user_id: e.author.id,
      discord_channel_id: e.channelId,
    }).save();

    const monster = await new Monster({
      user_id: e.author.id,
      type: 'Banana',
    }).save();

    await new Notes({
      user_id: e.author.id,
      text: 'Monster Academy is the most prestigious and only academy in all of Monster Town. It is my dream to attend Monster Academy! I plan on writing essays until I get in!',
      subject: 'Monster Academy',
      ideas:
        'Monster Academy is the most prestitguous and only academy in all of Monster Town.$$It is my dream to attend Monster Academy! ',
      quality: 100,
      category: 'Education And Pedagogy',
    }).save();

    await new Notes({
      user_id: e.author.id,
      text: 'My name is Banana, and I am a monster who lives in Monster Town. I am 450 monster years old. My favorite thing to do, other than write essays, is roller skate! I love learning and want to study everything!',
      subject: 'Banana',
      ideas:
        'My name is Banana, and I am a monster who lives in Monster Town.$$I love learning and want to study everything!',
      quality: 100,
      category: 'Celebrity',
    }).save();

    return monster;
  } catch (e) {
    console.log(e);
  }
};
