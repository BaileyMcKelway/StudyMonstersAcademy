const {
  client,
  monsterMessages,
  monsterDoesNotKnowMessages,
  subjectMessages,
} = require('../chat/constants');

const logger = require('../logger');
const { User } = require('../database/models');

const monsterKnows = (thingsMonsterKnows, subjectResponse) => {
  return thingsMonsterKnows.includes(
    subjectResponse.data.choices[0].message.content
      .replace('Subject: ', '')
      .toLowerCase()
  );
};

module.exports = async (e) => {
  logger.info(
    `MessageCreate interaction for user [discordSnowflake=${e.author.id}]`
  );
  if (e.author.bot === true) return;

  let user = await User.findOne({ where: { discordSnowflake: e.author.id } });
  if (!user) {
    user = await new User({ discordSnowflake: e.author.id }).save();
  }
  const thingsMonsterKnows = ['pine cones', 'cake'];
  try {
    const subjectResponse = await client.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0.1,
      n: 1,
      messages: subjectMessages(e),
    });
    if (monsterKnows(thingsMonsterKnows, subjectResponse)) {
      const chatResponse = await client.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0.9,
        n: 1,
        messages: monsterMessages(e),
      });
      e.reply(chatResponse.data.choices[0].message);
    } else {
      const chatResponse = await client.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0.9,
        n: 1,
        messages: monsterDoesNotKnowMessages(e),
      });
      e.reply(chatResponse.data.choices[0].message);
    }
  } catch (e) {
    e.reply('Can you say that again?');
    console.log(e.response);
  }
};
