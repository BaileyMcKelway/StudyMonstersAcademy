const { User, Monster } = require('../models');
const logger = require('../../logger');

module.exports = async (e) => {
  logger.info(`Creating user [user_id=${e.author.id}]`);
  try {
    const user = await new User({
      user_id: e.author.id,
      discord_channel_id: e.channelId,
    }).save();

    const monster = await new Monster({
      user_id: e.author.id,
      type: 'Banana',
    }).save();

    return monster;
  } catch (e) {
    console.log(e);
  }
};
