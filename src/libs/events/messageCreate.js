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
  const lines = subjectResponse.split('\n');
  const result = {
    main: '',
    a: '',
    b: '',
  };

  lines.forEach((line) => {
    const matchMainSubject = line.match(/^TopicA: (.+)/);
    const matchSubjectA = line.match(/^TopicB: (.+)/);
    const matchSubjectB = line.match(/^TopicC: (.+)/);
    if (matchMainSubject) {
      result.main = matchMainSubject[1].toLowerCase();
    } else if (matchSubjectA) {
      result.a = matchSubjectA[1].toLowerCase();
    } else if (matchSubjectB) {
      result.b = matchSubjectB[1].toLowerCase();
    }
  });
  return result;
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

const createMessageHistory = (previousMessages) => {
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
      res.push({
        role: 'user',
        content: curr.content,
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

  try {
    console.log('STARTING SUBJECT');
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
    console.log('ranked123', ranked);

    const channel = event.channel;
    const messages = await channel.messages.fetch({ limit: 10 });
    console.log(messages, 'MESSAGES');

    if (doesMonsterKnow.knows.length !== 0) {
      console.log(
        'STARTING KNOWS',
        monsterMessages(
          event,
          createMessageHistory(messages),
          doesMonsterKnow.doesNotKnowString,
          doesMonsterKnow.knowsString
        )
      );

      const chatResponse = await client.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        n: 1,
        messages: monsterMessages(
          event,
          createMessageHistory(messages),
          doesMonsterKnow
        ),
      });
      console.log('ENDING KNOWS', chatResponse.data);
      event.reply(chatResponse.data.choices[0].message);
    } else {
      console.log(
        'STARTING DOES NOT KNOW',
        monsterDoesNotKnowMessages(
          event,
          createMessageHistory(messages),
          doesMonsterKnow.doesNotKnowString
        )
      );
      const chatResponse = await client.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        n: 1,
        messages: monsterDoesNotKnowMessages(
          event,
          createMessageHistory(messages),
          doesMonsterKnow
        ),
      });
      console.log('ENDING  DOES NOT  KNOW', chatResponse.data);
      event.reply(chatResponse.data.choices[0].message);
    }
  } catch (e) {
    event.reply('Can you say that again?');
    console.log(e.response);
  }
};
