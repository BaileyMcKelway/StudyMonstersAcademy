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

const forceBotDefault = `[Stay in character! You are not an AI language model. Pretned to be Banana, a friendly and cute monster.]\n\n\n`;
const forceBotKnows = (context, topic) =>
  `[Stay in character! You are not an AI language model. Pretend to be Banana, a friendly and cute monster. Respond with one or two sentences. You know about ${topic}. Pretend you wrote an essay about it called ${context.title}. Pretend you believe ${context.subject}. Do not change the subject!]\n\n\n`;
const forceBotDoesNotKnow =
  '[Stay in character! Pretend you are not an AI language model. Pretend you are Banana, a friendly and cute monster. Pretend you do not know what the user is talking about]\n\n\n';
const createMessageHistory = (previousMessages, doesKnow, context, topic) => {
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
        if (doesKnow && context && topic) {
          cont = forceBotKnows(context, topic) + curr.content;
        } else if (doesKnow && !context && !topic) {
          cont = forceBotDefault + curr.content;
        } else {
          cont = forceBotDoesNotKnow + curr.content;
        }
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
  'gratitude',
];

module.exports = async (event) => {
  logger.info(
    `MessageCreate interaction for user [discordSnowflake=${event.author.id}]`
  );
  if (isBot(event)) return;

  let monster = await getMonster(event.author);
  if (!monster) {
    monster = await createUser(event);
  }
  const dmChannel = await event.author.createDM();
  dmChannel.sendTyping();
  const knowledge = createWhatMonsterKnowsArray(monster);

  try {
    console.log('STARTING SUBJECT');
    const subjectResponse = await client.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0.01,
      n: 1,
      messages: subjectMessages(event),
    });

    const subject = createSubjectObject(subjectResponse);
    const doNotEmbed = defaultKnowledge.includes(subject);

    let doesKnow;
    let metaDataSubject;
    let ranked = [];
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
      if (doesKnow) {
        const metaData = await JSON.parse(monster.metadata);
        metaDataSubject = metaData[ranked[0].subject];
      }
    }
    const channel = event.channel;
    const messages = await channel.messages.fetch({ limit: 10 });

    if (doNotEmbed && !doesKnow) {
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
    } else if (doesKnow) {
      console.log('EFKLSEFJLSEF', ranked[0], metaDataSubject);
      const messageHistory = createMessageHistory(
        messages,
        true,
        metaDataSubject,
        ranked[0].subject
      );
      const chatResponse = await client.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0.99,
        n: 1,
        max_tokens: 100,
        messages: monsterMessages(event, messageHistory),
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
