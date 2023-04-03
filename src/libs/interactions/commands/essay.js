const { SlashCommandBuilder } = require('@discordjs/builders');
const { client, essayCreation } = require('../../chat/constants');
const essaySkeletons = require('../../essayStructure/constants');
const {
  getNotes,
  getMonster,
  createEssay,
  updateMonster,
  deleteNotes,
} = require('../../database/utils');

const calculateExperienceGained = (notes) => {
  const avgQuality =
    notes.reduce((acc, curr) => {
      return acc + curr.quality / 100;
    }, 0) / notes.length;

  return Math.floor(avgQuality * 100);
};

const createMonsterMetaData = async (
  metadata,
  noteTitles,
  essayTitle,
  essaySubject
) => {
  const parsedMetaData = await JSON.parse(metadata);
  parsedMetaData[noteTitles[0].toLowerCase()] = {
    title: essayTitle,
    subject: essaySubject,
  };
  parsedMetaData[noteTitles[1].toLowerCase()] = {
    title: essayTitle,
    subject: essaySubject,
  };
  parsedMetaData[noteTitles[2].toLowerCase()] = {
    title: essayTitle,
    subject: essaySubject,
  };
  console.log('parsedMetaData123', parsedMetaData);
  return parsedMetaData;
};

const handleMonsterExperience = async ({
  interaction,
  gainedExperience,
  noteTitles,
  essayObject,
}) => {
  const { level, experience, knowledge, metadata } = await getMonster(
    interaction.user
  );

  const newMetaData = await createMonsterMetaData(
    metadata,
    noteTitles,
    essayObject.title,
    essayObject.mainIdea
  );

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
    newMetaData,
  });

  return {
    hasLeveledUp,
    totalLevelExperience,
    level,
    experience,
    newMetaData,
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

const createEssayPrompt = (essayTitle, topics) => {
  return `Write a funny short essay titled "${essayTitle}" Using the main ideas below,\n\nIdea: ${topics[0].ideaA}\nIdea:  ${topics[0].ideaB}\nIdea: ${topics[1].ideaA}\nIdea:  ${topics[1].ideaB}\nIdea: ${topics[2].ideaA}\nIdea:  ${topics[2].ideaB}\n\n Return the title, essay, and main idea \n\n`;
};

const parseEssay = (inputString) => {
  const lines = inputString.split('\n');
  const result = {
    title: '',
    essay: '',
    mainIdea: '',
  };
  lines.forEach((line) => {
    const matchTitle = line.match(/^Title: (.+)/);
    const matchEssay = line.match(/^Essay: (.+)/);
    const matchMainIdea = line.match(/^Main Idea: (.+)/);

    if (matchTitle) {
      result.title = matchTitle[1];
    } else if (matchEssay) {
      result.essay = matchEssay[1];
    } else if (matchMainIdea) {
      result.mainIdea = matchMainIdea[1];
    }
  });
  return result;
};

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
          content: 'You did not enter enough notes for me to create an essay!',
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

      const topics = handleTopics(notes);

      const currentEssaySkeleton =
        essaySkeletons[topics[0].category] || essaySkeletons.default;
      const essayTitle = currentEssaySkeleton(topics[0], topics[1], topics[2]);

      const essayPrompt = createEssayPrompt(essayTitle, topics);
      const response = await client.createCompletion({
        model: 'text-davinci-003',
        prompt: essayCreation(essayPrompt),
        temperature: 0.97,
        max_tokens: 589,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      console.log('response123', response?.data?.choices[0].text);
      const essayObject = parseEssay(response?.data?.choices[0].text);

      await interaction.editReply(
        essayObject.title + '\n\n' + essayObject.essay
      );

      const noteIds = notes.map((note) => note.id);
      const gainedExperience = calculateExperienceGained(notes);

      const { hasLeveledUp, totalLevelExperience, level, experience } =
        await handleMonsterExperience({
          interaction,
          gainedExperience,
          noteTitles,
          essayObject,
        });

      await createEssay({
        user: interaction.user,
        text: essayObject.essay,
        title: essayObject.title,
        category: topics[0].category,
      });
      await deleteNotes(interaction.user, noteIds);

      if (hasLeveledUp) {
        await interaction.followUp(
          `Oh wow you leveled up to level ${
            level + 1
          } after gaining ${gainedExperience} experience!`
        );
      } else {
        await interaction.followUp(
          `What a fantastic essay! I now know about ${noteTitles.join(
            ', '
          )} and have gained ${gainedExperience} experience! ${
            totalLevelExperience - (gainedExperience + experience)
          } more experience points until I level up to level ${level + 1}!`
        );
      }
    } catch (e) {
      console.log(e);
    }
  },
};
