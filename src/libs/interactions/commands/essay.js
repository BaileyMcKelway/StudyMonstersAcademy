const {
  ActionRowBuilder,
  ButtonBuilder,
  InteractionCollector,
} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  getNotes,
  getMonster,
  createEssay,
  updateMonster,
  deleteNotes,
} = require('../../database/utils');

const isSlashCmd = (interaction) => interaction.type === 2;
const isNotBot = (m) => m?.author?.bot !== true;

const calculateExperienceGained = (notes) => {
  const avgQuality =
    notes.reduce((acc, curr) => {
      return acc + curr.quality / 100;
    }, 0) / notes.length;

  return Math.floor(100 * avgQuality);
};

const handleMonsterExperience = async (
  interaction,
  gainedExperience,
  noteTitles
) => {
  const { level, experience, knowledge, memory, comprehension } =
    await getMonster(interaction.user);
  const knowledgeArray = knowledge.split(',');
  noteTitles = noteTitles.map((note) => note.toLowerCase());
  const newKnowledge = [...new Set([...knowledgeArray, ...noteTitles])].join(
    ','
  );

  const sumExperience = gainedExperience + experience;
  const totalLevelExperience = level * 2 + 100;
  const hasLeveledUp = sumExperience > totalLevelExperience;

  await updateMonster({
    user: interaction.user,
    exp: hasLeveledUp ? sumExperience - totalLevelExperience : sumExperience,
    level,
    hasLeveledUp,
    newKnowledge,
  });

  return {
    hasLeveledUp,
    totalLevelExperience,
    memory,
    comprehension,
    level,
    experience,
  };
};

const essayCache = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('essay')
    .setDescription('Create an essay from three notes')
    .addStringOption((option) =>
      option
        .setName('essay_input')
        .setDescription('Input the titles like this: /essay note1 note2 note3')
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      if (isSlashCmd(interaction)) {
        await interaction.deferReply({ ephemeral: true });

        let noteTitles = interaction.options
          .getString('essay_input')
          .split(',');
        noteTitles = noteTitles.map((str) => {
          if (typeof str === 'string') {
            return str.trim().slice(0, 1) === ' '
              ? str.trim().slice(1)
              : str.trim();
          } else {
            return str;
          }
        });

        if (noteTitles.length > 3) {
          await interaction.editReply({
            content: 'You entered to many notes!',
          });
          return;
        }
        if (noteTitles.length < 3) {
          await interaction.editReply({
            content:
              'You did not enter enough notes for me to create an essay!',
          });
          return;
        }

        let notes = await getNotes(interaction.user, noteTitles);
        console.log('notes123', notes);
        if (notes.length < 3) {
          await interaction.editReply({
            content: 'Hmmm looks like one of the notes is missing',
          });
          return;
        }

        notes = notes.map((note) => {
          return note.dataValues;
        });

        if (essayCache.has(userId)) {
          essayCache.delete(userId);
        }
        essayCache.set(userId, {
          notes: notes,
        });
      }
      const questionUp = new ButtonBuilder()
        .setCustomId(`questionUp_essay_${userId}${interaction.id}`)
        .setLabel('Yes')
        .setEmoji('👍')
        .setStyle('Primary');

      const questionDown = new ButtonBuilder()
        .setCustomId(`questionDown_essay_${userId}${interaction.id}`)
        .setLabel('No')
        .setEmoji('👎')
        .setStyle('Primary');

      const row = new ActionRowBuilder().addComponents(
        questionUp,
        questionDown
      );

      const filter = (m) =>
        (m.customId === `questionUp_essay_${userId}${interaction.id}` ||
          m.customId === `questionDown_essay_${userId}${interaction.id}`) &&
        m.user.id === userId;

      const collector = new InteractionCollector(interaction.client, {
        filter,
        max: 3,
        time: 1000 * 60,
      });

      if (isSlashCmd(interaction)) {
        await interaction.editReply({
          content: 'test0',
          components: [row],
        });
      }
      collector.on('collect', async (m) => {
        if (isNotBot(m) && !collector.checkEnd()) {
          await m.reply({
            content: 'test' + collector.total,
            components: [row],
          });
          return;
        }
      });

      collector.on('end', async (collected, reason) => {
        const lastReply = collected.get(collected.lastKey());
        if (lastReply && collected.size === 3) {
          const notes = essayCache.get(userId);
          const noteTitles = notes.notes.map((note) => note.subject);
          const gainedExperience = calculateExperienceGained(notes.notes);
          const {
            hasLeveledUp,
            totalLevelExperience,
            memory,
            comprehension,
            level,
            experience,
          } = await handleMonsterExperience(
            interaction,
            gainedExperience,
            noteTitles
          );

          await createEssay(interaction.user, 'EXAMPLE ESSAY');
          await deleteNotes(interaction.user, noteTitles);

          if (hasLeveledUp) {
            await lastReply.reply(
              `Oh wow you leveled up to level ${level + 1} after gaining ${
                gainedExperience + experience
              } experience! You currently have ${memory} memory🧠 and ${comprehension} comprehension🤔. Which do you want to increase?`
            );
          } else {
            await lastReply.reply(
              `What a fantastic essay! I now know about ${noteTitles.join(
                ', '
              )} and have gained ${gainedExperience} experience! ${
                totalLevelExperience - (gainedExperience + experience)
              } more experience points until I level up to level ${level + 1}!`
            );
          }

          essayCache.delete(userId);
        }
      });
    } catch (e) {
      console.log(e);
    }
  },
};
