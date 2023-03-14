const {
  ActionRowBuilder,
  ButtonBuilder,
  InteractionCollector,
} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  client,
  trueOrFalseMessages,
  subjectAndIdeasMessages,
} = require('../../chat/constants');
const { createNote, getMonster, getNotes } = require('../../database/utils');

const isSlashCmd = (interaction) => interaction.type === 2;
const isNotBot = (m) => m?.author?.bot !== true;

const parseQuestionAndAnwser = (inputString) => {
  const pairs = inputString.split(/\d+\. /).slice(1);

  const outputArray = pairs.map((pair) => {
    let [question, answer] = pair.trim().split(' Answer: ');
    question = question.replace('Question: ', '');
    return { question, answer };
  });

  return outputArray;
};

const parseSubjectAndIdeas = (inputString) => {
  const lines = inputString.split('\n');
  const result = {
    subject: '',
    ideaA: '',
    ideaB: '',
  };
  lines.forEach((line) => {
    const matchSubject = line.match(/^Subject: (.+)/);
    const matchIdeaA = line.match(/^IdeaA: (.+)/);
    const matchIdeaB = line.match(/^IdeaB: (.+)/);
    if (matchSubject) {
      result.subject = matchSubject[1];
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
        .setDescription('Copy and paste text into field to train monster')
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      if (isSlashCmd(interaction)) {
        await interaction.deferReply({ ephemeral: true });
      }
      const notes = await getNotes(interaction.user);
      const monster = await getMonster(interaction.user);

      if (monster.memory + 3 <= notes.length) {
        return interaction.editReply(
          'You have the maximum number of notes already created! Time to write an essay!'
        );
      }
      const userId = interaction.user.id;
      const trueAnswerID = `answerTrue_teach_${userId}${interaction.id}`;
      const falseAnswerID = `answerFalse_teach_${userId}${interaction.id}`;
      const questionUp = new ButtonBuilder()
        .setCustomId(trueAnswerID)
        .setLabel('Yes')
        .setEmoji('👍')
        .setStyle('Primary');

      const questionDown = new ButtonBuilder()
        .setCustomId(falseAnswerID)
        .setLabel('No')
        .setEmoji('👎')
        .setStyle('Primary');

      const row = new ActionRowBuilder().addComponents(
        questionUp,
        questionDown
      );

      const filter = (m) =>
        (m.customId === trueAnswerID || m.customId === falseAnswerID) &&
        m.user.id === userId;

      const collector = new InteractionCollector(interaction.client, {
        filter,
        max: 3,
        time: 1000 * 60,
      });

      if (isSlashCmd(interaction)) {
        const trueOrFalseResponse = await client.createChatCompletion({
          model: 'gpt-3.5-turbo',
          temperature: 0.1,
          n: 1,
          messages: trueOrFalseMessages(interaction),
        });

        const questionArray = parseQuestionAndAnwser(
          trueOrFalseResponse.data.choices[0].message.content
        );

        if (questionsCache.has(userId)) {
          questionsCache.delete(userId);
        }
        questionsCache.set(userId, {
          questions: questionArray,
          text: interaction.options.getString('teach_input'),
        });

        await interaction.editReply({
          content: questionArray[0].question,
          components: [row],
        });
      }
      collector.on('collect', async (m) => {
        if (isNotBot(m) && !collector.checkEnd()) {
          const questions = questionsCache.get(userId).questions;
          await m.reply({
            content: questions[collector.total].question,
            components: [row],
          });
          return;
        }
      });

      collector.on('end', async (collected, reason) => {
        console.log('reason123', reason);
        const lastReply = collected.get(collected.lastKey());
        const collectedSize = collected.size;
        if (lastReply && collectedSize === 3) {
          await lastReply.deferReply({ ephemeral: true });

          const userQuestions = questionsCache.get(userId);
          const subjectAndMainIdeas = await client.createChatCompletion({
            model: 'gpt-3.5-turbo',
            temperature: 0.1,
            n: 1,
            messages: subjectAndIdeasMessages(userQuestions.text),
          });

          const { subject, ideaA, ideaB } = parseSubjectAndIdeas(
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
          });

          await lastReply.editReply({
            content: '',
            embeds: [
              {
                title: 'New Note!',
                color: 14588438,
                fields: [
                  {
                    name: `Quality ${quality}%`,
                    value: '',
                  },
                ],
              },
            ],
          });
          questionsCache.delete(userId);
        }
      });
    } catch (e) {
      console.log(e);
    }
  },
};
