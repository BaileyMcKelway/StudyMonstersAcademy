import logger from '../../logger';
import {
  openai,
  monsterMessagesBeginner,
  monsterMessagesIntermediate,
  monsterMessagesAdvanced,
  monsterMessagesEndGame,
  monsterDoesNotKnowMessages,
  monsterDoesNotKnowExcuseMessages,
  subjectMessages,
} from '../../chat/constants';
import Fuse from 'fuse.js';
import cosineSimilarity from 'compute-cosine-similarity';
import { getMonster, createUser } from '../../database/utils';

export interface eventProps {
  channel?: any;
  author?: any;
  content?: any;
  reply?: any;
  role?: string;
}
export const isBot = (event: eventProps) => event.author.bot === true;

export const options = {
  includeScore: true,
  shouldSort: true,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
};

export interface messageProps {
  role: string;
  content: string;
  author: { bot: boolean };
}

export const findLastMonsterRoleMessage = (data: messageProps[]) => {
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

export const createWhatMonsterKnowsArray = (monster: { knowledge: string }) => {
  const knowledge = monster.knowledge;
  const knowledgeArray = knowledge
    .split(',')
    .filter((item: string) => item !== '');
  return knowledgeArray ? knowledgeArray : [];
};

export const createSubjectObject = (subjectResponse: {
  data: { choices: any[] };
}) => {
  if (!subjectResponse) return 'none';
  let subjectResponseContent =
    subjectResponse?.data?.choices[0].message.content;
  if (!subjectResponseContent) subjectResponseContent = 'none';
  const matchMainSubject = subjectResponseContent.match(/^Subject: (.+)/);
  if (!matchMainSubject) return 'none';

  return matchMainSubject[1].toLowerCase();
};

export interface createMessageHistoryProps {
  previousMessages: messageProps[];
  doesKnow?: boolean;
  kindaKnows?: boolean;
  context?: { mainIdea: string; title: string; notes: string };
  topic?: string;
  makeExcuse?: boolean;
}

export const createMessageHistory = ({
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

export const defaultKnowledge = [
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

export const forceBotDefault = `[Stay in character! You are not an AI language model. Pretend to be Banana, a friendly and cute monster. Pretend you are talking to someone who is a very good friend. Don't introduce yourself everytime you respond.]\n\n\n`;

export const forceBotKnows = (
  context: { mainIdea: string; title: string; notes: string },
  topic: string
) =>
  `[Stay in character! You are not an AI language model. Pretend to be Banana, a friendly and cute monster. Respond with one or two sentences. You know about ${topic}. Pretend you wrote an essay about it called "${context.title}". Pretend you believe ${context.mainIdea}. Pretend you believe ${context.notes}. Pretend you are talking to someone who is a very good friend. Don't introduce yourself everytime you respond.]\n\n\n`;

export const forceBotKindaKnows = (
  context: { mainIdea: string; title: string; notes: string },
  topic: string
) =>
  `[Stay in character! You are not an AI language model. Pretend to be Banana, a friendly and cute monster. Respond with one or two sentences. You think what the user is talking about is ${topic} but you are not sure. Pretend you wrote an essay about it called "${context.title}". Pretend you believe ${context.mainIdea}. Pretend you are talking to someone who is a very good friend. Don't introduce yourself everytime you respond.]\n\n\n`;

export const forceBotDoesNotKnow = (topic?: string) =>
  `[Stay in character! Pretend you are not an AI language model. Pretend you are Banana, a friendly and cute monster. Pretend you do not know anything about ${topic}. Don't introduce yourself everytime you respond.]\n\n\n`;

export const forceBotDoesNotKnowExcuse = (topic: string) =>
  `[Stay in character! Pretend you are not an AI language model. Pretend you are Banana, a friendly and cute monster. Pretend you don't actually know what ${topic} is and you were just pretending to know. Don't introduce yourself everytime you respond.]\n\n\n`;

export const logMessageCreation = (authorId: string) => {
  logger.info(`MessageCreate interaction for user [user id=${authorId}]`);
};

export const fetchOrCreateMonster = async (author: any) => {
  let monster = await getMonster({ user: author });
  if (!monster) monster = await createUser({ user: author });
  return monster;
};

export const notifyTypingToAuthor = async (author: any) => {
  const dmChannel = await author.createDM();
  dmChannel.sendTyping();
};

export const fetchRecentMessages = async (channel: any, limit: number = 10) => {
  return await channel.messages.fetch({ limit });
};

export const handleOpenAIInteractions = async (
  event: any,
  messages: any,
  knowledge: any,
  monster: any
) => {
  const subjectResponse = await requestSubjectFromOpenAI(event);
  const subject = createSubjectObject(subjectResponse);
  const rankedKnowledge = rankKnowledgeBySimilarity(event, knowledge);

  handleChatResponse(event, messages, monster, subject, rankedKnowledge);
};

export const requestSubjectFromOpenAI = async (event: any) => {
  return await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0.01,
    n: 1,
    messages: subjectMessages(event) as any,
  });
};

export const rankKnowledgeBySimilarity = async (event: any, knowledge: any) => {
  const embeddingResults = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: [event.content, ...knowledge],
  });

  if (!embeddingResults) return [];

  const embeddings = embeddingResults.data.data.map((entry) => entry.embedding);
  const userEmbedding = embeddings[0];
  const knowledgeEmbeddings = embeddings.slice(1);

  const knowledgeEmbeddingsObject = knowledge.map((ele: string, i: number) => ({
    subject: ele,
    embedding: knowledgeEmbeddings[i],
  }));

  const ranked = knowledgeEmbeddingsObject.map((knowledgeEmbedding) => {
    const similarity =
      cosineSimilarity(knowledgeEmbedding.embedding, userEmbedding) || 0;
    return {
      subject: knowledgeEmbedding.subject,
      similarity: similarity,
    };
  });

  return ranked.sort((a, b) => b.similarity - a.similarity);
};

export const handleChatResponse = async (
  event: any,
  messages: any,
  monster: any,
  subject: any,
  rankedKnowledge: any
) => {
  const metaData = await JSON.parse(monster.metadata);
  const metaDataSubject = metaData[rankedKnowledge[0]?.subject];
  const doesKnow = rankedKnowledge[0]?.similarity >= 0.825;
  const kindaKnows =
    rankedKnowledge[0]?.similarity < 0.825 &&
    rankedKnowledge[0]?.similarity >= 0.817;
  const doNotEmbed = defaultKnowledge.includes(subject);

  let monsterMessages = monsterMessagesBeginner;

  if (monster.level >= 10) monsterMessages = monsterMessagesEndGame;
  else if (monster.level >= 7) monsterMessages = monsterMessagesAdvanced;
  else if (monster.level >= 3) monsterMessages = monsterMessagesIntermediate;

  const baseChatCompletionOptions = {
    model: 'gpt-3.5-turbo',
    temperature: 0.99,
    n: 1,
    max_tokens: 100,
  };

  let responseOptions = {};
  if (doNotEmbed && !doesKnow) {
    responseOptions = {
      ...baseChatCompletionOptions,
      messages: monsterMessages(
        event,
        createMessageHistory({ previousMessages: messages, doesKnow: true })
      ),
    };
  } else if (doesKnow) {
    responseOptions = {
      ...baseChatCompletionOptions,
      messages: monsterMessages(
        event,
        createMessageHistory({
          previousMessages: messages,
          doesKnow: true,
          context: metaDataSubject,
          topic: rankedKnowledge[0].subject,
        })
      ),
    };
  } else if (kindaKnows) {
    responseOptions = {
      ...baseChatCompletionOptions,
      messages: monsterMessages(
        event,
        createMessageHistory({
          previousMessages: messages,
          doesKnow: false,
          kindaKnows: true,
          context: metaDataSubject,
          topic: rankedKnowledge[0].subject,
        })
      ),
    };
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
      ) {
        makeExcuse = true;
      }
    }

    responseOptions = makeExcuse
      ? {
          ...baseChatCompletionOptions,
          messages: monsterDoesNotKnowExcuseMessages(
            event,
            createMessageHistory({
              previousMessages: messages,
              doesKnow: false,
              topic: subject,
              makeExcuse,
            })
          ),
        }
      : {
          ...baseChatCompletionOptions,
          messages: monsterDoesNotKnowMessages(
            event,
            createMessageHistory({
              previousMessages: messages,
              doesKnow: false,
              topic: subject,
              makeExcuse,
            })
          ),
        };
  }

  const chatResponse = await openai.createChatCompletion(
    responseOptions as any
  );
  await event.reply(chatResponse.data.choices[0].message);
};

export const handleError = async (e: any, event: any) => {
  logger.error(e, 'An error occurred executing a message');
  event.reply('Can you say that again?');
  console.log(e);
};
