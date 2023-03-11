const {
  ActionRowBuilder,
  ButtonBuilder,
  InteractionCollector,
} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { client, trueOrFalseMessages } = require('../../chat/constants');

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
      const userId = interaction.user.id;
      const questionUp = new ButtonBuilder()
        .setCustomId(`questionUp_teach_${userId}${interaction.id}`)
        .setLabel('Yes')
        .setEmoji('👍')
        .setStyle('Primary');

      const questionDown = new ButtonBuilder()
        .setCustomId(`questionDown_teach_${userId}${interaction.id}`)
        .setLabel('No')
        .setEmoji('👎')
        .setStyle('Primary');

      const row = new ActionRowBuilder().addComponents(
        questionUp,
        questionDown
      );

      const filter = (m) =>
        (m.customId === `questionUp_teach_${userId}${interaction.id}` ||
          m.customId === `questionDown_teach_${userId}${interaction.id}`) &&
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

      collector.on('end', async (collected) => {
        const lastReply = collected.get(collected.lastKey());
        if (lastReply && collected.size === 3) {
          const userQuestions = questionsCache.get(userId);
          await collected.get(collected.lastKey()).reply({
            content: '',
            embeds: [
              {
                title: 'New Note!',
                color: 14588438,
                fields: [
                  {
                    name: `Quality ${(3 / 3) * 100}%`,
                    value: '',
                  },
                  {
                    name: ``,
                    value: userQuestions.text,
                  },
                ],
              },
            ],
          });
        }
        questionsCache.delete(userId);
      });
    } catch (e) {
      console.log(e);
    }
  },
};
