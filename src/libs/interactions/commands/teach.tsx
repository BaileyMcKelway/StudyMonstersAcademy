import {
  ActionRowBuilder,
  ButtonBuilder,
  InteractionCollector,
} from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { teachingEndings } from '../teachConstants';
import {
  openai,
  trueOrFalseMessages,
  subjectAndIdeasMessages,
} from '../../chat/constants';
import { createNote, getNotes } from '../../database/utils';

const isSlashCmd = (interaction) => interaction.type === 2;
const isNotBot = (m) => m?.author?.bot !== true;

const teachFillers = () => {
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

const parseQuestionAndAnwser = (inputString) => {
  const pairs = inputString.split(/\d+\. /).slice(1);

  const outputArray = pairs.map((pair) => {
    let [question, answer] = pair.trim().split(' Answer: ');
    question = question.replace('Question: ', '');
    return { question, answer };
  });

  return outputArray;
};

const parseSubjectCategoryAndIdeas = (inputString) => {
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

const calculateCorrect = (collected, userQuestions) => {
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

const questionsCache = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('teach')
    .setDescription('Teach your monster something new and create a note')
    .addStringOption((option) =>
      option
        .setName('teach_input')
        .setDescription('Copy and paste text into the field to teach monster')
        .setRequired(true)
    ),

  async execute(interaction, monster) {
    try {
      if (isSlashCmd(interaction)) {
        await interaction.deferReply({ ephemeral: true });
      }
      if (interaction.options.getString('teach_input').length < 85) {
        await interaction.editReply('I need more information than that!');
        return;
      }
      if (interaction.options.getString('teach_input').length >= 2000) {
        await interaction.editReply(
          'Oof! That is a lot of information for a little monster!'
        );
        return;
      }
      const notes = await getNotes(interaction.user, undefined);

      if (notes && notes.length >= 3) {
        await interaction.editReply(
          'I have all the **notes** I can handle! Time to write an **essay**!\n\nType `/lookup Notes` to view all your **notes** and then type `/essay` and input the titles of the notes separated by commas to write an **essay**! The **note** that you want to be the main idea of the **essay** goes first like this,\n\n `/essay Main Idea, Supporting Idea A, Supporting Idea B`'
        );
        return;
      }

      const userId = interaction.user.id;
      const trueAnswerID = `answerTrue_teach_${userId}${interaction.id}`;
      const falseAnswerID = `answerFalse_teach_${userId}${interaction.id}`;
      const questionUp = new ButtonBuilder()
        .setCustomId(trueAnswerID)
        .setLabel('Yes')
        .setEmoji('👍')
        .setStyle(1);

      const questionDown = new ButtonBuilder()
        .setCustomId(falseAnswerID)
        .setLabel('No')
        .setEmoji('👎')
        .setStyle(1);

      const row = new ActionRowBuilder().addComponents(
        questionUp,
        questionDown
      );

      const filter = (m) =>
        (m.customId === trueAnswerID || m.customId === falseAnswerID) &&
        m.user.id === userId;

      const collector = new InteractionCollector(interaction.client, {
        filter,
        max: 5,
        time: 1000 * 60,
      });

      if (isSlashCmd(interaction)) {
        const trueOrFalseResponse = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          temperature: 0.1,
          n: 1,
          messages: trueOrFalseMessages(interaction) as any,
        });
        if (
          !trueOrFalseResponse ||
          !trueOrFalseResponse.data ||
          !trueOrFalseResponse.data.choices ||
          !trueOrFalseResponse.data.choices[0] ||
          !trueOrFalseResponse.data.choices[0].message ||
          !trueOrFalseResponse.data.choices[0].message.content
        ) {
          return;
        }
        const questionArray = parseQuestionAndAnwser(
          trueOrFalseResponse.data.choices[0].message.content
        );

        questionsCache.delete(userId + interaction.id);
        questionsCache.set(userId + interaction.id, {
          questions: questionArray,
          text: interaction.options.getString('teach_input'),
        });

        const fillers = teachFillers();
        await interaction.editReply({
          content: fillers[0],
        });
        await interaction.followUp({
          content: fillers[1],
        });
        await interaction.followUp({
          content: questionArray[0].question,
          components: [row],
        });
      }
      collector.on('collect', async (m) => {
        if (isNotBot(m) && !collector.checkEnd()) {
          const questions = questionsCache.get(
            userId + interaction.id
          ).questions;
          const filers = teachFillers();
          await m.reply({
            content: filers[0],
          });

          await m.followUp({
            content: questions[collector.total].question,
            components: [row],
          });
          return;
        }
      });

      collector.on('end', async (collected, reason) => {
        const lastReply = await collected.get(collected.lastKey() || '');
        const collectedSize = collected.size;
        const userCache = questionsCache.get(userId + interaction.id);
        if (lastReply && collectedSize === 5) {
          await lastReply.deferReply({ ephemeral: true });

          const userQuestions = questionsCache.get(userId + interaction.id);
          const subjectAndMainIdeas = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            temperature: 0.1,
            n: 1,
            messages: subjectAndIdeasMessages(userQuestions.text) as any,
          });

          const { subject, category, ideaA, ideaB } =
            parseSubjectCategoryAndIdeas(
              subjectAndMainIdeas?.data?.choices[0]?.message?.content
            );
          const totalCorrect = calculateCorrect(
            collected,
            userQuestions.questions
          );
          const quality = Math.floor((totalCorrect / collectedSize) * 100);
          await createNote({
            user: interaction.user,
            text: userQuestions.text,
            ideas: ideaA + '$$' + ideaB,
            quality: quality,
            subject,
            category,
          });

          await lastReply.editReply({
            content: '',
            embeds: [
              {
                title: 'New Note!',
                color: 14588438,
                fields: [
                  {
                    name: `Subject: ${subject}`,
                    value: '',
                  },
                  {
                    name: `Quality ${quality}%`,
                    value: '',
                  },
                ],
              },
            ],
          });
          if (monster.level === 1) {
            await lastReply.followUp(
              'So interesting! Since I already had two **notes** created I now have three total and can write an **essay**!\n\nType `/lookup Notes` to view my **notes**. Then enter `/essay` and input the titles of the notes like this; `Banana, Monster Academy, ' +
                subject +
                '` to write an **essay**!'
            );
          } else {
            await lastReply.followUp(teachingEndings(subject));
          }
          collector.stop();
        } else if (reason === 'time' && collectedSize === 0 && userCache) {
          await interaction.followUp(
            'Oh no! It looks like you took too long. That is okay, though!'
          );
          collector.stop();
        } else if (reason === 'time' && collectedSize < 5 && userCache) {
          await lastReply.followUp(
            'Oh no! It looks like you took too long. That is okay, though!'
          );
          collector.stop();
        }
        questionsCache.delete(userId + interaction.id);
      });
    } catch (e) {
      console.log(e);
    }
  },
};
