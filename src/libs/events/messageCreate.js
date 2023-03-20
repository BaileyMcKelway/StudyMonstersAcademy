const {
  client,
  monsterMessages,
  monsterDoesNotKnowMessages,
  subjectMessages,
} = require('../chat/constants');

const logger = require('../logger');
const { getMonster, createUser, updateMonster } = require('../database/utils');

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
  'help',
  'no subject detected',
  'no subject detected.',
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
const shouldUpdateComprehension = (reaction, user) =>
  reaction._emoji.name === '🤔' && reaction.count === 2 && user;
const shouldUpdateMemory = (reaction, user) =>
  reaction._emoji.name === '🧠' && reaction.count === 2 && user;

module.exports = async (event) => {
  logger.info(
    `MessageCreate interaction for user [discordSnowflake=${event.author.id}]`
  );

  if (isBot(event)) {
    if (event.content.includes(skillString)) {
      Promise.all([await event.react('🧠'), await event.react('🤔')]);

      const filter = (reaction) => {
        return (
          ['🧠', '🤔'].includes(reaction._emoji.name) &&
          reaction?.message?.reference?.channelId === event.channelId
        );
      };

      event
        .awaitReactions({ filter, max: 1, time: 10000, errors: ['time'] })
        .then(async (collected) => {
          const reaction = await collected.first();
          const users = await reaction.users.fetch();
          const user = await users.get(users.firstKey());
          if (shouldUpdateMemory(reaction, user)) {
            await updateMonster({
              user: user,
              skill: 'memory',
            });
            event.reply('Oh cool I can feel my brain getting bigger!');
          } else if (shouldUpdateComprehension(reaction, user)) {
            await updateMonster({
              user: user,
              skill: 'comprehension',
            });
            event.reply('Umm sorry could you repeat that? Hahaha just joking!');
          }
        })
        .catch((collected) => {
          event.reply('Oops sorry looks like you did not react to either');
        });
    }
    return;
  }

  let monster = await getMonster(event.author);
  if (!monster) {
    monster = await createUser(event);
  }
  const dmChannel = await event.author.createDM();
  dmChannel.sendTyping();
  const knowledge = createWhatMonsterKnowsArray(monster);
  const thingsMonsterKnows = [...defaultKnowledge, ...knowledge];

  try {
    console.log('STARTING CHAT COMPLETION', event);

    const subjectResponse = await client.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0.1,
      n: 1,
      messages: subjectMessages(event),
    });
    console.log('ENDING CHAT COMPLETION');
    const channel = event.channel;
    const messages = await channel.messages.fetch({ limit: 5 });

    if (monsterKnows(thingsMonsterKnows, subjectResponse)) {
      console.log('monster knows');
      const chatResponse = await client.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0.9,
        n: 1,
        messages: monsterMessages(event, createMessageHistory(messages)),
      });
      console.log('chatResponse123', chatResponse);
      event.reply(chatResponse.data.choices[0].message);
    } else {
      console.log('monster does not know');
      const chatResponse = await client.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0.9,
        n: 1,
        messages: monsterDoesNotKnowMessages(
          event,
          createMessageHistory(messages)
        ),
      });
      console.log('chatResponse123', chatResponse);
      event.reply(chatResponse.data.choices[0].message);
    }
  } catch (e) {
    event.reply('Can you say that again?');
    console.log(e.response);
  }
};
