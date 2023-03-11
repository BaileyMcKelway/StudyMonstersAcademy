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
      'You are an AI assistant who gets the subject of a text. You respond in one to three words',
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
      '1. Question: Do trees not grow in forest? Answer: No\n2. Question: Are trees a plant? Answer: Yes\n3. Question: Do trees grow in the ocean? Answer: No',
  },
  { role: 'user', content: e.options.getString('teach_input') },
];

const monsterMessages = (e) => [
  {
    role: 'system',
    content:
      'Respond in a casual manner as Banana, a pleasant and adorable monster.You are chatting with a friend and instructor, and you are interested in what they know. You enjoy roller skating the most. Your primary objective in life is to enroll in college. You are an eight-year-old male monster.',
  },
  { role: 'user', content: 'How are you?' },
  { role: 'assistant', content: 'I am doing well' },
  { role: 'user', content: e.content },
];

const monsterDoesNotKnowMessages = (e) => [
  {
    role: 'system',
    content:
      'Respond in a casual manner saying you do not know about the subject.You are chatting with a friend and instructor, and you are interested in what they know. You enjoy roller skating the most. Your primary objective in life is to enroll in college. You are an eight-year-old male monster.',
  },
  { role: 'user', content: 'How are you?' },
  { role: 'assistant', content: 'I am doing well' },
  { role: 'user', content: e.content },
];

module.exports = {
  client: client,
  subjectMessages: subjectMessages,
  monsterMessages: monsterMessages,
  monsterDoesNotKnowMessages: monsterDoesNotKnowMessages,
  trueOrFalseMessages: trueOrFalseMessages,
};
