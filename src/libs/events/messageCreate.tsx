import {
  openai,
  monsterMessagesBeginner,
  monsterMessagesIntermediate,
  monsterMessagesAdvanced,
  monsterMessagesEndGame,
  monsterDoesNotKnowMessages,
  monsterDoesNotKnowExcuseMessages,
  subjectMessages,
} from '../chat/constants';
import Fuse from 'fuse.js';
import { BLOCKED_CHANNELS } from '../global';
import { AttachmentBuilder } from 'discord.js';
import cosineSimilarity from 'compute-cosine-similarity';
import { getMonster, createUser } from '../database/utils';
import logger from '../logger';

interface eventProps {
  channel?: any;
  author?: any;
  content?: any;
  reply?: any;
  role?: string;
}

const isBot = (event: eventProps) => event.author.bot === true;

const options = {
  includeScore: true,
  shouldSort: true,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
};

interface messageProps {
  role: string;
  content: string;
  author: { bot: boolean };
}
const findLastMonsterRoleMessage = (data: messageProps[]) => {
  let lastAssistant = '';

  const dataArr = Array.from(data.values());
  for (let i = 0; i < dataArr.length; i++) {
    const curr = dataArr[i];
    const isBot = curr.author.bot === true;
    if (isBot) {
      lastAssistant = curr.content;
      break;
    }
  }
  return lastAssistant !== '' ? lastAssistant.toLowerCase().split(' ') : null;
};

const createWhatMonsterKnowsArray = (monster: { knowledge: any }) => {
  const knowledge = monster.knowledge;
  const knowledgeArray = knowledge
    .split(',')
    .filter((item: string) => item !== '');
  return knowledgeArray ? knowledgeArray : [];
};

const createSubjectObject = (subjectResponse: { data: { choices: any[] } }) => {
  if (!subjectResponse) return 'none';
  let subjectResponseContent =
    subjectResponse?.data?.choices[0].message.content;
  if (!subjectResponseContent) subjectResponseContent = 'none';
  const matchMainSubject = subjectResponseContent.match(/^Subject: (.+)/);
  if (!matchMainSubject) return 'none';

  return matchMainSubject[1].toLowerCase();
};
interface createMessageHistoryProps {
  previousMessages: messageProps[];
  doesKnow?: boolean;
  kindaKnows?: boolean;
  context?: { mainIdea: string; title: string; notes: string };
  topic?: string;
  makeExcuse?: boolean;
}
const createMessageHistory = ({
  previousMessages,
  doesKnow,
  kindaKnows,
  context,
  topic,
  makeExcuse,
}: createMessageHistoryProps) => {
  let res: { role: string; content: string }[] = [];

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
        } else if (makeExcuse && !doesKnow && topic) {
          cont = forceBotDoesNotKnowExcuse(topic) + curr.content;
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

const forceBotDefault = `[Stay in character! You are not an AI language model. Pretend to be Banana, a friendly and cute monster. Pretend you are talking to someone who is a very good friend. Don't introduce yourself everytime you respond.]\n\n\n`;

const forceBotKnows = (
  context: { mainIdea: string; title: string; notes: string },
  topic: string
) =>
  `[Stay in character! You are not an AI language model. Pretend to be Banana, a friendly and cute monster. Respond with one or two sentences. You know about ${topic}. Pretend you wrote an essay about it called "${context.title}". Pretend you believe ${context.mainIdea}. Pretend you believe ${context.notes}. Pretend you are talking to someone who is a very good friend. Don't introduce yourself everytime you respond.]\n\n\n`;

const forceBotKindaKnows = (
  context: { mainIdea: string; title: string; notes: string },
  topic: string
) =>
  `[Stay in character! You are not an AI language model. Pretend to be Banana, a friendly and cute monster. Respond with one or two sentences. You think what the user is talking about is ${topic} but you are not sure. Pretend you wrote an essay about it called "${context.title}". Pretend you believe ${context.mainIdea}. Pretend you are talking to someone who is a very good friend. Don't introduce yourself everytime you respond.]\n\n\n`;

const forceBotDoesNotKnow = (topic?: string) =>
  `[Stay in character! Pretend you are not an AI language model. Pretend you are Banana, a friendly and cute monster. Pretend you do not know anything about ${topic}. Don't introduce yourself everytime you respond.]\n\n\n`;

const forceBotDoesNotKnowExcuse = (topic: string) =>
  `[Stay in character! Pretend you are not an AI language model. Pretend you are Banana, a friendly and cute monster. Pretend you don't actually know what ${topic} is and you were just pretending to know. Don't introduce yourself everytime you respond.]\n\n\n`;

export default async (event: eventProps) => {
  if (isBot(event)) return;
  if (BLOCKED_CHANNELS.includes(event.channel.id)) return;
  logger.info(
    `MessageCreate interaction for user [user id=${event.author.id}]`
  );
  let monster = await getMonster({ user: event.author });
  if (!monster) monster = await createUser({ user: event.author });
  if (!monster) return;

  const dmChannel = await event.author.createDM();
  dmChannel.sendTyping();

  const channel = event.channel;
  const messages: messageProps[] = await channel.messages.fetch({ limit: 10 });
  const knowledge = createWhatMonsterKnowsArray(monster);

  try {
    const subjectResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0.01,
      n: 1,
      messages: subjectMessages(event) as any,
    });

    const subject = createSubjectObject(subjectResponse);
    const doNotEmbed = defaultKnowledge.includes(subject);

    let doesKnow: boolean | undefined;
    let kindaKnows: boolean | undefined;
    let metaDataSubject:
      | { mainIdea: string; title: string; notes: string }
      | undefined;
    let ranked: { subject: string; similarity: number }[] = [];
    if (!doNotEmbed && knowledge.length > 0) {
      const embeddingResults = await openai.createEmbedding({
        model: 'text-embedding-ada-002',
        input: [event.content, ...knowledge],
      });
      if (!embeddingResults) {
        doesKnow = false;
        kindaKnows = false;
        return;
      }
      const embeddings = embeddingResults.data.data.map(
        (entry) => entry.embedding
      );
      const userEmbeding = embeddings[0];
      const knowledgeEmbeddings = embeddings.slice(1);
      const knowledgeEmbeddingsObject = knowledge.map(
        (ele: string, i: number) => {
          return {
            subject: ele,
            embeding: knowledgeEmbeddings[i],
          };
        }
      );

      for (let i = 0; i < knowledgeEmbeddingsObject.length; i++) {
        const knowledgeEmbedding = knowledgeEmbeddingsObject[i];
        const similarity =
          cosineSimilarity(knowledgeEmbedding.embeding, userEmbeding) || 0;
        ranked.push({
          subject: knowledgeEmbedding.subject,
          similarity: similarity,
        });
      }
      ranked = ranked.sort((a, b) => (b.similarity > a.similarity ? 1 : -1));
      doesKnow = ranked[0].similarity >= 0.825;
      kindaKnows =
        ranked[0].similarity < 0.825 && ranked[0].similarity >= 0.817;
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
      const lastMonsterMessage = findLastMonsterRoleMessage(messages);
      let makeExcuse = false;
      if (lastMonsterMessage) {
        const fuse = new Fuse(lastMonsterMessage, options);
        const fuzzyRes = fuse.search(subject.toLowerCase());
        if (
          fuzzyRes.length > 0 &&
          fuzzyRes[0]?.score &&
          fuzzyRes[0]?.score <= 0.3
        )
          makeExcuse = true;
      }

      if (makeExcuse) {
        const chatResponse = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          temperature: 0.99,
          n: 1,
          messages: monsterDoesNotKnowExcuseMessages(
            event,
            createMessageHistory({
              previousMessages: messages,
              doesKnow: false,
              topic: subject,
              makeExcuse,
            })
          ) as any,
        });
        await event.reply(chatResponse?.data?.choices[0]?.message);
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
              makeExcuse,
            })
          ) as any,
        });
        await event.reply(chatResponse?.data?.choices[0]?.message);
      }

      if (monster.level === 1) {
        const filePath = process.cwd() + '/src/assets/teach_example.png';
        const file = new AttachmentBuilder(filePath);

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
    logger.error(e, 'An error occured executing a message');
    event.reply('Can you say that again?');
    console.log(e);
  }
};
