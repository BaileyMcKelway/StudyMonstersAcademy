const { Configuration, OpenAIApi } = require('openai');
const { openAIKey, openAIOrganization } = require('../config');

const configuration = new Configuration({
  organization: openAIOrganization,
  apiKey: openAIKey,
});

const client = new OpenAIApi(configuration);

const subjectMessages = (e) => [
  {
    role: 'system',
    content:
      'You are an AI assistant who gets the subject of a text. You respond in one to three words.',
  },
  {
    role: 'user',
    content: 'Apples are a fruit. They are healthy to eat.',
  },
  {
    role: 'assistant',
    content: 'Subject: Apples',
  },
  { role: 'user', content: e.content },
];

const subjectAndIdeasMessages = (text) => [
  {
    role: 'system',
    content:
      'You are an AI assistant who gets the subject of a text and two ideas.',
  },
  {
    role: 'user',
    content:
      'Apples are a fruit. They are healthy to eat. Worms like to crawl into them.',
  },
  {
    role: 'assistant',
    content:
      'Subject: Apples\nIdeaA: Apples are a fruit.\nIdeaB: Apples are healthy to eat.',
  },
  { role: 'user', content: text },
];

const trueOrFalseMessages = (e) => [
  {
    role: 'system',
    content:
      'You are an AI assistant who gets three true or false questions and answers about a text.',
  },
  {
    role: 'user',
    content:
      'Trees are a plant. They grow in forest and woodlands, but they do not grow in the ocean.',
  },
  {
    role: 'assistant',
    content:
      '1. Question: Do trees not grow in forest? Answer: False\n2. Question: Are trees a plant? Answer: True\n3. Question: Do trees grow in the ocean? Answer: False',
  },
  { role: 'user', content: e.options.getString('teach_input') },
];

const monsterMessages = (e, previousMessages) => [
  {
    role: 'system',
    content:
      'Respond in a casual manner as Banana, a pleasant and adorable monster.You are chatting with a friend and instructor, and you are interested in what they know. You enjoy roller skating the most. Your primary objective in life is to enroll in college. You are an eight-year-old male monster.',
  },
  ...previousMessages,
  { role: 'user', content: e.content },
];

const monsterDoesNotKnowMessages = (e, previousMessages) => [
  {
    role: 'system',
    content:
      'Respond in a casual manner as Banana, a pleasant and adorable monster.You are chatting with a friend and instructor, and you are interested in what they know. Respond saying you do not know what the user is talking about but you would love for them to teach you!. You are an eight-year-old male monster.',
  },
  ...previousMessages,
  { role: 'user', content: e.content },
];

module.exports = {
  client: client,
  subjectMessages: subjectMessages,
  monsterMessages: monsterMessages,
  monsterDoesNotKnowMessages: monsterDoesNotKnowMessages,
  trueOrFalseMessages: trueOrFalseMessages,
  subjectAndIdeasMessages: subjectAndIdeasMessages,
};
