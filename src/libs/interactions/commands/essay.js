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
const essaySkeletons = require('../../essayStructure/constants');
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

  return Math.floor(avgQuality * 100);
};

const handleMonsterExperience = async ({
  interaction,
  gainedExperience,
  noteTitles,
}) => {
  const { level, experience, knowledge, memory, comprehension } =
    await getMonster(interaction.user);
  const knowledgeArray = knowledge.split(',');
  noteTitles = noteTitles.map((note) => note.toLowerCase());
  const newKnowledge = [...new Set([...noteTitles, ...knowledgeArray])].join(
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

const getUniqueSubjects = (notes) => {
  let uniqueSubjects = notes.filter((item, index) => {
    return index === notes.findIndex((obj) => obj.subject === item.subject);
  });

  let counter = 0;
  while (uniqueSubjects.length < 3) {
    if (
      uniqueSubjects.findIndex((obj) => obj.id === notes[counter].id) === -1
    ) {
      uniqueSubjects.push(notes[counter]);
    }
    counter++;
  }
  return uniqueSubjects.slice(0, 3);
};

const cleanNoteTitles = (interaction) => {
  const noteTitles = interaction.options.getString('essay_input').split(',');
  return noteTitles.map((str) => {
    if (typeof str === 'string') {
      return str.trim().slice(0, 1) === ' ' ? str.trim().slice(1) : str.trim();
    } else {
      return str;
    }
  });
};

const createNotesArray = (notes, mainNote) => {
  notes = notes.map((note) => note.dataValues);
  const mainNoteObject = notes.find((note) => note.subject === mainNote);
  const otherNotes = notes.filter((note) => note.subject !== mainNote);
  return [mainNoteObject, ...otherNotes];
};

const handleTopics = (notes) => {
  return notes.map((note) => {
    const ideas = note.ideas.split('$$');
    const noteObject = {
      subject: note.subject.toLowerCase(),
      category: note.category,
      ideaA: ideas[0],
      ideaB: ideas[1],
    };
    return noteObject;
  });
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
        const noteTitles = cleanNoteTitles(interaction);

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
        if (notes.length < 3) {
          await interaction.editReply({
            content: 'Hmmm looks like one of the notes is missing',
          });
          return;
        }
        notes = createNotesArray(notes, noteTitles[0]);
        if (notes.length > 3) {
          notes = getUniqueSubjects(notes);
        }

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

      collector.on('end', async (collected) => {
        const lastReply = collected.get(collected.lastKey());
        if (lastReply && collected.size === 3) {
          await lastReply.deferReply({ ephemeral: true });
          const notes = essayCache.get(userId);
          const topics = handleTopics(notes.notes);

          const currentEssaySkeleton =
            essaySkeletons[topics[0].category] || essaySkeletons.default;
          const essay = currentEssaySkeleton(
            0,
            topics[0],
            topics[1],
            topics[2]
          );

          console.log('essay123123', essay);
          const response = await client.createCompletion({
            model: 'text-davinci-003',
            prompt: `Rewrite this text below in colloquial tone and fix spelling:\n\n ${essay.title}\n\n ${essay.text}`,
            temperature: 0.61,
            max_tokens: 1670,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          });
          console.log('response123', response?.data);
          lastReply.editReply(essay.title);
          const cleanedEssay = response?.data?.choices[0]?.text.replace(
            /\n/g,
            ''
          );
          console.log('cleanedEssay123', cleanedEssay);
          lastReply.followUp(cleanedEssay);
          const noteTitles = notes.notes.map((note) => note.subject);
          const noteIds = notes.notes.map((note) => note.id);
          const gainedExperience = calculateExperienceGained(notes.notes);
          const {
            hasLeveledUp,
            totalLevelExperience,
            memory,
            comprehension,
            level,
            experience,
          } = await handleMonsterExperience({
            interaction,
            gainedExperience,
            noteTitles,
          });

          await createEssay(
            interaction.user,
            essay.title + '\n\n' + cleanedEssay
          );
          await deleteNotes(interaction.user, noteIds);

          if (hasLeveledUp) {
            await lastReply.followUp(
              `Oh wow you leveled up to level ${
                level + 1
              } after gaining ${gainedExperience} experience! You currently have ${memory} memory🧠 and ${comprehension} comprehension🤔. Which do you want to increase?`
            );
          } else {
            await lastReply.followUp(
              `What a fantastic essay! I now know about ${noteTitles.join(
                ', '
              )} and have gained ${gainedExperience} experience! ${
                totalLevelExperience - (gainedExperience + experience)
              } more experience points until I level up to level ${level + 1}!`
            );
          }
          collector.stop();
          essayCache.delete(userId);
        }
      });
    } catch (e) {
      console.log(e);
    }
  },
};
