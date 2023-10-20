import { getNotes } from '../../database/utils';

export const isSlashCmd = (interaction) => interaction.type === 2;
export const isNotBot = (m) => m?.author?.bot !== true;

export const teachFillers = () => {
  const teachFillersText = [
    'This information is interesting!',
    'This is very complex!',
    'I am going to need some coffee after this!',
    'My brain is working hard.',
    'This is all fascinating stuff.',
    'This is a challenging topic.',
    'Can not wait to apply this information in an essay!',
    'Hmm yes very interesting.',
    'I am learning so much!',
    'Interesting!',
    'Wow, this is amazing!',
    'This is blowing my mind!',
    'I am shooketh by this!',
    'I have never heard of this!',
    'My mind is completely blown!',
    'This is so eye-opening!',
    'I am completely captivated by this.',
    'I am loving this new knowledge!',
  ];
  const teachFillersQuestionsText = [
    'Wait I have a question!',
    'Hold on!',
    'Wait a second!',
    'Wait!',
    'Hold up!',
    'Wait a minute!',
    'Hold on a second!',
    'Wait a second!',
    'Hold up a second!',
  ];

  return [
    teachFillersText[Math.floor(Math.random() * teachFillersText.length)],
    teachFillersQuestionsText[
      Math.floor(Math.random() * teachFillersQuestionsText.length)
    ],
  ];
};

export const parseQuestionAndAnwser = (inputString) => {
  const pairs = inputString.split(/\d+\. /).slice(1);

  const outputArray = pairs.map((pair) => {
    let [question, answer] = pair.trim().split(' Answer: ');
    question = question.replace('Question: ', '');
    return { question, answer };
  });

  return outputArray;
};

export const parseSubjectCategoryAndIdeas = (inputString) => {
  const lines = inputString.split('\n');
  const result = {
    subject: '',
    category: '',
    ideaA: '',
    ideaB: '',
  };
  lines.forEach((line) => {
    const matchSubject = line.match(/^Subject: (.+)/);
    const matchCategory = line.match(/^Category: (.+)/);
    const matchIdeaA = line.match(/^IdeaA: (.+)/);
    const matchIdeaB = line.match(/^IdeaB: (.+)/);
    if (matchSubject) {
      result.subject = matchSubject[1];
    } else if (matchCategory) {
      result.category = matchCategory[1];
    } else if (matchIdeaA) {
      result.ideaA = matchIdeaA[1];
    } else if (matchIdeaB) {
      result.ideaB = matchIdeaB[1];
    }
  });
  return result;
};

export const calculateCorrect = (collected, userQuestions) => {
  let correct = 0;
  let counter = 0;
  if (!collected) {
    return correct;
  }

  collected.forEach((collect) => {
    const isUserAnswerTrue = collect.customId.includes('answerTrue');
    const isQuestionAnswerTrue =
      userQuestions[counter].answer === 'True' ||
      userQuestions[counter].answer === 'Yes';

    if (isUserAnswerTrue === isQuestionAnswerTrue) {
      correct++;
    }
    counter++;
  });
  return correct;
};

export const sendInteractionReply = async (interaction, message) => {
  await interaction.editReply(message);
};

export const handleShortOrLongInput = async (interaction) => {
  const teachInput = interaction.options.getString('teach_input');
  if (teachInput.length < 85) {
    return 'I need more information than that!';
  }
  if (teachInput.length >= 2000) {
    return 'Oof! That is a lot of information for a little monster!';
  }
  return null;
};

export const handleMaxNotes = async (interaction) => {
  const notes = await getNotes(interaction.user, undefined);
  if (notes && notes.length >= 3) {
    return 'I have all the **notes** I can handle! Time to write an **essay**!\n\nType `/lookup Notes` to view all your **notes** and then type `/essay` and input the titles of the notes separated by commas to write an **essay**! The **note** that you want to be the main idea of the **essay** goes first like this,\n\n `/essay Main Idea, Supporting Idea A, Supporting Idea B`';
  }
  return null;
};
