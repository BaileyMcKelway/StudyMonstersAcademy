const {
  client,
  monsterMessages,
  monsterDoesNotKnowMessages,
  subjectMessages,
} = require('../chat/constants');
const Fuse = require('fuse.js');
const cosineSimilarity = require('compute-cosine-similarity');
const logger = require('../logger');
const { getMonster, createUser, updateMonster } = require('../database/utils');

const isBot = (event) => event.author.bot === true;
const createWhatMonsterKnowsArray = (monster) => {
  const knowledge = monster.knowledge;
  return knowledge.split(',').filter((item) => item !== '');
};

const options = {
  includeScore: true,
  shouldSort: true,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
};

const createSubjectObject = (subjectResponse) => {
  subjectResponse = subjectResponse.data.choices[0].message.content;
  const matchMainSubject = subjectResponse.match(/^Subject: (.+)/);
  console.log(
    'matchMainSubject',
    matchMainSubject[1],
    matchMainSubject[1].toLowerCase()
  );
  return matchMainSubject[1].toLowerCase();
};

const monsterKnows = (defaultKnowledge, knowledge, subjectResponse) => {
  const { main, a, b } = subjectResponse;

  const fuse = new Fuse(knowledge, options);
  const result = { main: false, a: false, b: false };
  const resultsMain = fuse.search(main);
  console.log('resultsMain', resultsMain);
  if (
    (resultsMain.length > 0 && resultsMain[0].score <= 0.3) ||
    main.indexOf('none') === 0 ||
    defaultKnowledge.includes(main)
  ) {
    result.main = true;
  } else {
    result.main = false;
  }

  const resultsA = fuse.search(a);
  console.log('resultsA', resultsA);
  if (resultsA.length > 0 && resultsA[0].score <= 0.3) {
    result.a = true;
  } else {
    result.a = false;
  }

  const resultsB = fuse.search(b);
  console.log('resultsB', resultsB);
  if (resultsB.length > 0 && resultsB[0].score <= 0.3) {
    result.b = true;
  } else {
    result.b = false;
  }

  const knows = [];
  const doesNotKnow = [];

  for (let key in result) {
    if (result[key]) {
      knows.push(subjectResponse[key]);
    } else {
      doesNotKnow.push(subjectResponse[key]);
    }
  }

  const knowsString = knows.join(' and ');

  const doesNotKnowString = doesNotKnow
    .filter((ele) => ele !== 'none')
    .join(' or ');
  return { knows, doesNotKnow, doesNotKnowString, knowsString };
};

const forceBotKnows =
  '[Stay in character! You are not an AI language model. You are Banana, a friendly and cute monster who likes roller skating and wants to get into college.]\n\n\n';
const forceBotDoesNotKnow =
  '[Stay in character! You are not an AI language model. You are Banana, a friendly and cute monster who likes roller skating and wants to get into college. You do not know what the user is talking about]\n\n\n';
const createMessageHistory = (previousMessages, doesKnow) => {
  let res = [];

  const previousMessagesArr = Array.from(previousMessages.values());
  for (let i = previousMessagesArr.length - 1; i >= 0; i--) {
    const curr = previousMessagesArr[i];
    const isUser = curr.author.bot !== true;
    if (!isUser) {
      res.push({
        role: 'assistant',
        content: curr.content,
      });
    } else {
      let cont = curr.content;

      if (i === 0) {
        cont = doesKnow
          ? forceBotKnows + curr.content
          : forceBotDoesNotKnow + curr.content;
      }
      res.push({
        role: 'user',
        content: cont,
      });
    }
  }

  return res;
};

const defaultKnowledge = [
  'essay',
  'learn',
  'learning',
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
  'compliment',
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
  console.log(
    'vent.content.includes(skillString)',
    event.content.includes(skillString),
    event
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
  const meta = await JSON.parse(monster.metadata);
  console.log('JSONasddsas', meta);
  try {
    console.log('STARTING SUBJECT');
    const subjectResponse = await client.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0.01,
      n: 1,
      messages: subjectMessages(event),
    });

    const subject = createSubjectObject(subjectResponse);
    console.log('subject123', subject);
    const doNotEmbed = defaultKnowledge.includes(subject);
    console.log('doNotEmbed', doNotEmbed);
    let doesKnow;
    if (!doNotEmbed && knowledge.length > 0) {
      const embeddingResults = await client.createEmbedding({
        model: 'text-embedding-ada-002',
        input: [event.content, ...knowledge],
      });
      const embeddings = embeddingResults.data.data.map(
        (entry) => entry.embedding
      );
      const userEmbeding = embeddings[0];
      const knowledgeEmbeddings = embeddings.slice(1);
      const knowledgeEmbeddingsObject = knowledge.map((ele, i) => {
        return {
          subject: ele,
          embeding: knowledgeEmbeddings[i],
        };
      });

      let ranked = [];

      for (let i = 0; i < knowledgeEmbeddingsObject.length; i++) {
        const knowledgeEmbedding = knowledgeEmbeddingsObject[i];
        const similarity = cosineSimilarity(
          knowledgeEmbedding.embeding,
          userEmbeding
        );
        ranked.push({
          subject: knowledgeEmbedding.subject,
          similarity: similarity,
        });
      }
      ranked = ranked.sort((a, b) => (b.similarity > a.similarity ? 1 : -1));

      doesKnow = ranked[0].similarity > 0.8;
    }
    const channel = event.channel;
    const messages = await channel.messages.fetch({ limit: 10 });

    if (doNotEmbed || doesKnow) {
      console.log(
        'created message',
        monsterMessages(event, createMessageHistory(messages, true))
      );
      const chatResponse = await client.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0.99,
        n: 1,
        messages: monsterMessages(event, createMessageHistory(messages, true)),
      });

      event.reply(chatResponse.data.choices[0].message);
    } else {
      const chatResponse = await client.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0.99,
        n: 1,
        messages: monsterDoesNotKnowMessages(
          event,
          createMessageHistory(messages, false)
        ),
      });
      event.reply(chatResponse.data.choices[0].message);
    }
  } catch (e) {
    event.reply('Can you say that again?');
    console.log(e.response);
  }
};
