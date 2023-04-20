const {
  openai,
  monsterMessagesBeginner,
  monsterMessagesIntermediate,
  monsterMessagesAdvanced,
  monsterMessagesEndGame,
  monsterDoesNotKnowMessages,
  subjectMessages,
} = require('../chat/constants');
const { AttachmentBuilder } = require('discord.js');
const cosineSimilarity = require('compute-cosine-similarity');
const { serverId } = require('../config');
const { getMonster, createUser } = require('../database/utils');
const logger = require('../logger');
const isBot = (event) => event.author.bot === true;
const createWhatMonsterKnowsArray = (monster) => {
  const knowledge = monster.knowledge;
  return knowledge.split(',').filter((item) => item !== '');
};

const createSubjectObject = (subjectResponse) => {
  subjectResponse = subjectResponse.data.choices[0].message.content;
  console.log('subjectResponse', subjectResponse);
  const matchMainSubject = subjectResponse.match(/^Subject: (.+)/);
  if (!matchMainSubject) {
    return 'none';
  }
  return matchMainSubject[1].toLowerCase();
};

const forceBotDefault = `[Stay in character! You are not an AI language model. Pretend to be Banana, a friendly and cute monster. Pretend you are talking to someone who is a very good friend. Don't introduce yourself everytime you respond.]\n\n\n`;

const forceBotKnows = (context, topic) =>
  `[Stay in character! You are not an AI language model. Pretend to be Banana, a friendly and cute monster. Respond with one or two sentences. You know about ${topic}. Pretend you wrote an essay about it called "${context.title}". Pretend you believe ${context.mainIdea}. Pretend you believe ${context.notes}. Pretend you are talking to someone who is a very good friend. Don't introduce yourself everytime you respond.]\n\n\n`;

const forceBotKindaKnows = (context, topic) =>
  `[Stay in character! You are not an AI language model. Pretend to be Banana, a friendly and cute monster. Respond with one or two sentences. You think what the user is talking about is ${topic} but you are not sure. Pretend you wrote an essay about it called "${context.title}". Pretend you believe ${context.mainIdea}. Pretend you are talking to someone who is a very good friend. Don't introduce yourself everytime you respond.]\n\n\n`;

const forceBotDoesNotKnow = (topic) =>
  `[Stay in character! Pretend you are not an AI language model. Pretend you are Banana, a friendly and cute monster. Pretend you do not know anything about ${topic}. Pretend you are talking to someone who is a very good friend. Don't introduce yourself everytime you respond.]\n\n\n`;

const createMessageHistory = ({
  previousMessages,
  doesKnow,
  kindaKnows,
  context,
  topic,
}) => {
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
        } else if (kindaKnows && context && topic) {
          cont = forceBotKindaKnows(context, topic) + curr.content;
        } else if (doesKnow && !context && !topic) {
          cont = forceBotDefault + curr.content;
        } else {
          cont = forceBotDoesNotKnow(topic) + curr.content;
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
  'monster town',
  'dr. kiwano',
  'they',
  'kiwano',
];

module.exports = async (event, client) => {
  logger.info(
    `MessageCreate interaction for user [user id=${event.author.id}]`
  );

  if (isBot(event)) return;

  let monster = await getMonster({ user: event.author });
  if (!monster) monster = await createUser({ event });

  const dmChannel = await event.author.createDM();
  dmChannel.sendTyping();

  const knowledge = createWhatMonsterKnowsArray(monster);

  const channel = event.channel;
  const messages = await channel.messages.fetch({ limit: 10 });

  if (monster.level >= 2) {
    const guild = await client.guilds.cache.get(serverId);
    const member = await guild.members.fetch(event.author.id);
    const roles = await member.roles.cache.map((role) => role.name);
    if (
      !roles.includes('Premium') &&
      !messages.find((m) => m.content.includes(`😄🥳 Awesome! My first essay!`))
    ) {
      const file = new AttachmentBuilder(
        '/Users/baileymckelway/Documents/VS-STUDIO/StudyMonsterz/src/assets/study_monster_academy.png'
      );

      await event.reply({
        content: '  ',
        embeds: [
          {
            title: 'Subscribe to Study Monsters Academy to continue! 💳',
            description:
              'You have reached the maximum amount of messages you can send to your study monster. Please subscribe to continue.',
            color: 14588438,
            image: {
              url: 'attachment://study_monster_academy.png',
            },
          },
        ],
        files: [file],
      });
      return;
    }
  }

  try {
    console.log('STARTING SUBJECT');
    const subjectResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0.01,
      n: 1,
      messages: subjectMessages(event),
    });

    const subject = createSubjectObject(subjectResponse);
    const doNotEmbed = defaultKnowledge.includes(subject);

    let doesKnow;
    let kindaKnows;
    let metaDataSubject;
    let ranked = [];
    if (!doNotEmbed && knowledge.length > 0) {
      const embeddingResults = await openai.createEmbedding({
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
      doesKnow = ranked[0].similarity >= 0.825;
      kindaKnows = ranked[0].similarity < 0.825 && ranked[0].similarity >= 0.8;
      if (doesKnow || kindaKnows) {
        const metaData = await JSON.parse(monster.metadata);
        metaDataSubject = metaData[ranked[0].subject];
      }
    }
    let monsterMessages = monsterMessagesBeginner;
    if (monster.level >= 10) monsterMessages = monsterMessagesEndGame;
    else if (monster.level >= 7) monsterMessages = monsterMessagesAdvanced;
    else if (monster.level >= 3) monsterMessages = monsterMessagesIntermediate;

    if (doNotEmbed && !doesKnow) {
      const chatResponse = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0.99,
        n: 1,
        messages: monsterMessages(
          event,
          createMessageHistory({
            previousMessages: messages,
            doesKnow: true,
          })
        ),
      });
      await event.reply(chatResponse.data.choices[0].message);
    } else if (doesKnow) {
      const messageHistory = createMessageHistory({
        previousMessages: messages,
        doesKnow: true,
        context: metaDataSubject,
        topic: ranked[0].subject,
      });
      const chatResponse = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0.99,
        n: 1,
        max_tokens: 100,
        messages: monsterMessages(event, messageHistory),
      });

      await event.reply(chatResponse.data.choices[0].message);
    } else if (kindaKnows) {
      const messageHistory = createMessageHistory({
        previousMessages: messages,
        doesKnow: false,
        kindaKnows: true,
        context: metaDataSubject,
        topic: ranked[0].subject,
      });
      const chatResponse = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0.99,
        n: 1,
        max_tokens: 100,
        messages: monsterMessages(event, messageHistory),
      });

      await event.reply(chatResponse.data.choices[0].message);
    } else {
      const chatResponse = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0.99,
        n: 1,
        messages: monsterDoesNotKnowMessages(
          event,
          createMessageHistory({
            previousMessages: messages,
            doesKnow: false,
            topic: subject,
          })
        ),
      });
      await event.reply(chatResponse.data.choices[0].message);

      if (monster.level === 1) {
        const file = new AttachmentBuilder(
          '/Users/baileymckelway/Documents/VS-STUDIO/StudyMonsterz/src/assets/teach_example.png'
        );

        await event.reply({
          content: '',
          embeds: [
            {
              title: 'How to teach your Study Monster',
              description:
                'You can teach your monster by typing `/teach` and then writing about the subject you want to teach it! Write everything you know about that one subject, even if it is silly. Your Study Monster still wants to learn about it! Check out the image below for an example.',
              color: 14588438,
              image: {
                url: 'attachment://teach_example.png',
              },
            },
          ],
          files: [file],
        });
      }
    }
  } catch (e) {
    event.reply('Can you say that again?');
    console.log(e);
  }
};
