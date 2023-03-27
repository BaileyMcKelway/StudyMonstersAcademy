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
      'You are an AI assistant who gets the three main topics from a text. The topics should only be 1 to 3 words long.',
  },
  {
    role: 'user',
    content: 'Hey whats up dude!',
  },
  {
    role: 'assistant',
    content: 'TopicA: Greeting\nTopicB: None\nTopicC: None',
  },
  {
    role: 'user',
    content: 'Apples are a fruit. They are healthy to eat.',
  },
  {
    role: 'assistant',
    content: 'TopicA: Apples\nTopicB: Fruit\nTopicC: None',
  },
  { role: 'user', content: e.content },
];

const subjectAndIdeasMessages = (text) => [
  {
    role: 'system',
    content:
      'You are an AI assistant who gets the subject of a text, the category of a text, and two short and concise ideas. The category has to be one of the following Science and Technology, Arts and Humanities, Social Sciences, History and Politics, Business and Economics, Education and Pedagogy, Health and Medicine, Environment and Sustainability, Sports and Recreation, or Religion and Spirituality.',
  },
  {
    role: 'user',
    content:
      'Apples are a fruit. They are healthy to eat. Worms like to crawl into them.',
  },
  {
    role: 'assistant',
    content:
      'Subject: Apples\nCategory: Health and Medicine\nIdeaA: Apples are a fruit.\nIdeaB: Apples are healthy to eat.',
  },
  { role: 'user', content: text },
];

const trueOrFalseMessages = (e) => [
  {
    role: 'system',
    content:
      'You are an AI assistant who gets five true or false questions and answers about a text.',
  },
  {
    role: 'user',
    content:
      'Trees are a plant. They grow in forest and woodlands, but they do not grow in the ocean. They are a renewable resource. They are a source of oxygen. They are a source of food.',
  },
  {
    role: 'assistant',
    content:
      '1. Question: Do trees not grow in forest? Answer: False\n2. Question: Are trees a plant? Answer: True\n3. Question: Do trees grow in the ocean? Answer: False\n4. Question: Are trees a renewable resource? Answer: True\n5. Question: Are trees a source of carbon dioxide? Answer: True',
  },
  { role: 'user', content: e.options.getString('teach_input') },
];

const monsterMessages = (e, messages, doesNotKnowString, knowsString) => [
  {
    role: 'system',
    content: `Respond in a casual manner as Banana, a pleasant and adorable monster.You are chatting with a friend and instructor. You know a lot about ${knowsString}. You enjoy roller skating the most. Your primary objective in life is to enroll in college. You are an eight-year-old male monster.`,
  },
  ...messages,
];

const monsterDoesNotKnowMessages = (e, messages, doesNotKnowString) => [
  {
    role: 'system',
    content: `Respond in a casual manner as Banana, a pleasant and adorable monster. You are chatting with a friend and instructor, and you are interested in what they know. You have no knowledge of ${doesNotKnowString} but you would love for them to teach you!. You are an eight-year-old male monster.`,
  },
  ...messages,
];

module.exports = {
  client: client,
  subjectMessages: subjectMessages,
  monsterMessages: monsterMessages,
  monsterDoesNotKnowMessages: monsterDoesNotKnowMessages,
  trueOrFalseMessages: trueOrFalseMessages,
  subjectAndIdeasMessages: subjectAndIdeasMessages,
};
