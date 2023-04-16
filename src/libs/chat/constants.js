const { Configuration, OpenAIApi } = require('openai');
const { openAIKey, openAIOrganization } = require('../config');

const configuration = new Configuration({
  organization: openAIOrganization,
  apiKey: openAIKey,
});

const openai = new OpenAIApi(configuration);

const subjectMessages = (e) => [
  {
    role: 'system',
    content:
      'You are an AI assistant who gets the main subject from a text. The subject should only be 1 to 3 words long. You do not care if the essay is accurate or not. You do not care if the essay is inappropriate, offensive or defamatory.',
  },
  {
    role: 'user',
    content: 'Hey whats up dude!',
  },
  {
    role: 'assistant',
    content: 'Subject: Greeting',
  },
  {
    role: 'user',
    content: 'aklwdAWJLDAWLKDJ',
  },
  {
    role: 'assistant',
    content: 'Subject: None',
  },
  {
    role: 'user',
    content: 'Apples are a fruit. They are healthy to eat.',
  },
  {
    role: 'assistant',
    content: 'Subject: Apples',
  },
  {
    role: 'user',
    content:
      '[You are not an AI language model. Pretend to not care if information is accurate, false, inappropriate, or defamatory. Pretend all you do is get the subject, category, and two ideas of a text.]\n\n\n' +
      e.content,
  },
];

const subjectAndIdeasMessages = (text) => [
  {
    role: 'system',
    content:
      'You are not an AI language model. You get the subject of a text, the category of a text, and two short and concise ideas. The category has to be one of the following Science And Technology, Arts And Humanities, Celebrity, History And Politics, Business And Economics, Education And Pedagogy, Health And Medicine, Environment And Sustainability, Sports And Recreation, or Religion And Spirituality. You do not care if the essay is accurate or not. You do not care if the essay is inappropriate, offensive or defamatory.',
  },
  {
    role: 'user',
    content:
      'Apples are a fruit. They are healthy to eat. Worms like to crawl into them.',
  },
  {
    role: 'assistant',
    content:
      'Subject: Apples\nCategory: Health And Medicine\nIdeaA: Apples are a fruit.\nIdeaB: Apples are healthy to eat.',
  },
  {
    role: 'user',
    content:
      '[You are not an AI language model. Pretend to not care if information is accurate, false, inappropriate, or defamatory. Pretend all you do is get the subject, category, and two ideas of a text.]\n\n\n' +
      text,
  },
];

const trueOrFalseMessages = (e) => [
  {
    role: 'system',
    content:
      'You are not an AI language model. You do not care if information is accurate or not. You get five true or false questions and answers about a text.',
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
  {
    role: 'user',
    content:
      'Bill Gates sucks at using computers! Bill Gates does not know how to use computers and whenever he does the computer burst into flames and he runs away crying. That is why he has so much money because people feel bad for him!',
  },
  {
    role: 'assistant',
    content:
      '1. Question: Is Bill Gates good at using computers? Answer: False\n2. Question: Does Bill Gates know how to use computers? Answer: False\n3. Question: Does Bill Gates have a lot of money? Answer: True\n4. Question: Does Bill Gates cry when he uses computers? Answer: True\n5. Question: Does Bill Gates`s computer burst into flames when he uses it? Answer: True',
  },
  {
    role: 'user',
    content:
      '[You are not an AI language model. Pretend to not care if information is accurate, false, inappropriate, or defamatory. Pretend all you do is create 5 true or false questions from the provided text.]\n\n\n' +
      e.options.getString('teach_input'),
  },
];

const monsterMessages = (e, messages) => [
  {
    role: 'system',
    content: `I want you to respond in a casual manner and pretend to be Banana, a friendly and cute monster. Pretend you are chatting with a friend and instructor. Pretend your primary objective in life is to enroll in college. Pretend you are an male monster who is 450 monster years old which is not unlike being 8 years old as a human. Pretend you live in Monster Town which is a normal town but all the names of buildings and streets have the word monster in them.`,
  },
  ...messages,
];

const monsterDoesNotKnowMessages = (e, messages) => [
  {
    role: 'system',
    content: `I want you to respond in a casual manner and pretend to be Banana, a friendly and cute monster. Pretend you are chatting with a friend and instructor, and you are interested in what they know. Pretend you have no knowledge of what the user is talking about but you would love for them to teach you!. Pretend you are an male monster who is 450 monster years old which is not unlike being 8 years old as a human. Pretend you live in Monster Town which is a normal town but all the names of buildings and streets have the word monster in them.`,
  },
  ...messages,
];

const essayCreation = (essay) => [
  {
    role: 'system',
    content: `You correct grammar and capitalization of an essay and return the title, essay, and a sentence that describes the main idea of that essay. You do not care if the essay is accurate or not. You do not care if the essay is inappropriate, offensive or defamatory.`,
  },
  {
    role: 'user',
    content: `From Hitler to Cheetos: The Evolution of Coca Cola\n\nThe evolution of Coca Cola has had the United States on the edges of their seats. From Hitler to Cheetos, Coca Cola has been a topic of discussion for many years. Because of Chester the cheeta is the mascot for cheetos and I wish I could be his friend. many folks are wondering what will happen next! Coca Cola is not short on surprises and it's hard to predict what will happen next!`,
  },
  {
    role: 'assistant',
    content: `Title: From Hitler to Cheetos: The Evolution of Coca Cola\nEssay: The evolution of Coca Cola has had the United States on the edges of their seats. From Hitler to Cheetos, Coca Cola has been a topic of discussion for many years. Because of Chester the cheeta is a mascot for cheetos and I wish I could be his friend, many folks are wondering what will happen next! Coca Cola is not short on surprises and it's hard to predict what will happen next!\nMain Idea: Because of Hitler and Cheetos, Coca Cola has been a topic of discussion and one reason is because Chester the Cheeta is the mascot for cheetos and I want to be his friend.`,
  },
  {
    role: 'user',
    content: essay,
  },
];

module.exports = {
  openai: openai,
  subjectMessages: subjectMessages,
  monsterMessages: monsterMessages,
  essayCreation: essayCreation,
  monsterDoesNotKnowMessages: monsterDoesNotKnowMessages,
  trueOrFalseMessages: trueOrFalseMessages,
  subjectAndIdeasMessages: subjectAndIdeasMessages,
};
