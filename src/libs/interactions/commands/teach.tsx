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
import { createNote } from '../../database/utils';
import {
  isSlashCmd,
  isNotBot,
  teachFillers,
  parseQuestionAndAnwser,
  parseSubjectCategoryAndIdeas,
  calculateCorrect,
  sendInteractionReply,
  handleShortOrLongInput,
  handleMaxNotes,
} from '../utils/teachUtils';

const questionsCache = new Map();

const handleSlashCmdInteraction = async (interaction, userId, row) => {
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
};

export default {
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
      const shortOrLongInputMessage = await handleShortOrLongInput(interaction);
      if (shortOrLongInputMessage) {
        return sendInteractionReply(interaction, shortOrLongInputMessage);
      }

      const maxNotesMessage = await handleMaxNotes(interaction);
      if (maxNotesMessage) {
        return sendInteractionReply(interaction, maxNotesMessage);
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
        await handleSlashCmdInteraction(interaction, userId, row);
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
