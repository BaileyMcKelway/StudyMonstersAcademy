const {
  client,
  monsterMessages,
  monsterDoesNotKnowMessages,
  subjectMessages,
} = require('../chat/constants');

const logger = require('../logger');
const { getMonster, createUser } = require('../database/utils');

const isBot = (event) => event.author.bot === true;
const createWhatMonsterKnowsArray = (monster) => {
  const knowledge = monster.knowledge;
  return knowledge.split(',');
};

const monsterKnows = (thingsMonsterKnows, subjectResponse) => {
  const subject = subjectResponse.data.choices[0].message.content
    .replace('Subject: ', '')
    .toLowerCase();
  console.log('subject123', subject);
  if (subject.indexOf('none') === 0) {
    return true;
  }
  return thingsMonsterKnows.includes(subject);
};

const createMessageHistory = (previousMessages) => {
  let res = [];
  let isUser = null;
  let roleToPush = 'user';

  const previousMessagesArr = Array.from(previousMessages.values());
  for (let i = previousMessagesArr.length - 1; i >= 0; i--) {
    if (res.length === 2) break;
    const curr = previousMessagesArr[i];
    isUser = curr.author.bot !== true;
    if (!isUser && roleToPush === 'bot') {
      res.push({
        role: 'assistant',
        content: curr.content,
      });
      roleToPush = 'user';
    } else if (isUser && roleToPush === 'user') {
      res.push({
        role: 'user',
        content: curr.content,
      });
      roleToPush = 'bot';
    }
  }
  return res;
};

const defaultKnowledge = [
  'no subject provided.',
  'no subject provided',
  'banana',
  'college',
  'university',
  'roller skating',
  'you',
  'greeting',
  'none (greeting)',
  'none (inappropriate language)',
  'none',
  'undefined',
];

const skillString = 'comprehension🤔. Which do you want to increase?';

module.exports = async (event) => {
  logger.info(
    `MessageCreate interaction for user [discordSnowflake=${event.author.id}]`
  );

  if (isBot(event)) {
    if (event.content.includes(skillString)) {
      await event.react('🧠');
      await event.react('🤔');

      const filter = (reaction, user) => {
        return (
          ['🧠', '🤔'].includes(reaction.emoji.name) &&
          user.id === interaction.user.id
        );
      };

      event
        .awaitReactions({ filter, max: 1, time: 60000, errors: ['time'] })
        .then((collected) => {
          const reaction = collected.first();

          if (reaction.emoji.name === '🧠') {
            message.reply('You reacted with a thumbs up.');
          } else {
            message.reply('You reacted with a thumbs down.');
          }
        })
        .catch((collected) => {
          message.reply(
            'You reacted with neither a thumbs up, nor a thumbs down.'
          );
        });
    }
    return;
  }

  let monster = await getMonster(event.author);
  if (!monster) {
    monster = await createUser(event);
  }

  const knowledge = createWhatMonsterKnowsArray(monster);
  const thingsMonsterKnows = [...defaultKnowledge, ...knowledge];

  try {
    const subjectResponse = await client.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0.1,
      n: 1,
      messages: subjectMessages(event),
    });

    const channel = event.channel;
    const messages = await channel.messages.fetch({ limit: 5 });

    if (monsterKnows(thingsMonsterKnows, subjectResponse)) {
      const chatResponse = await client.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0.9,
        n: 1,
        messages: monsterMessages(event, createMessageHistory(messages)),
      });
      event.reply(chatResponse.data.choices[0].message);
    } else {
      const chatResponse = await client.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0.9,
        n: 1,
        messages: monsterDoesNotKnowMessages(
          event,
          createMessageHistory(messages)
        ),
      });
      event.reply(chatResponse.data.choices[0].message);
    }
  } catch (e) {
    event.reply('Can you say that again?');
    console.log(e.response);
  }
};
