const { SlashCommandBuilder } = require('@discordjs/builders');
const { client, essayCreation } = require('../../chat/constants');
const letters = require('../../letters/constants');
const essaySkeletons = require('../../essays/constants');
const {
  getNotes,
  getMonster,
  createEssay,
  updateMonster,
  deleteNotes,
} = require('../../database/utils');

const removeLastPunctuation = (str) => {
  if (/[.,\/#!$%\^&\*;:{}=\-_`~()]/.test(str.slice(-1))) {
    str = str.slice(0, -1);
  }
  return str;
};

const combineSubjects = (subjects) => {
  const lastWord = subjects.pop();
  return subjects.join(', ') + ', and ' + lastWord;
};

const calculateExperienceGained = ({ notes, knowledgeArray }) => {
  // const filteredNotes = notes.filter(
  //   (note) => !knowledgeArray.includes(note.subject.toLowerCase())
  // );
  // if (filteredNotes.length === 0) return 0;

  const avgQuality =
    notes.reduce((acc, curr) => {
      return acc + curr.quality / 100;
    }, 0) / notes.length;

  return Math.floor(avgQuality * 100);
};

const createMonsterMetaData = async ({
  metadata,
  noteTitles,
  essayTitle,
  essayMainIdea,
}) => {
  const parsedMetaData = await JSON.parse(metadata);
  parsedMetaData[noteTitles[0].toLowerCase()] = {
    title: essayTitle,
    mainIdea: essayMainIdea,
  };
  parsedMetaData[noteTitles[1].toLowerCase()] = {
    title: essayTitle,
    mainIdea: essayMainIdea,
  };
  parsedMetaData[noteTitles[2].toLowerCase()] = {
    title: essayTitle,
    mainIdea: essayMainIdea,
  };
  console.log('parsedMetaData123', parsedMetaData);
  return parsedMetaData;
};

const handleMonsterExperience = async ({
  interaction,
  noteTitles,
  essayObject,
  notes,
}) => {
  const { level, experience, knowledge, metadata } = await getMonster(
    interaction.user
  );

  const knowledgeArray = knowledge.split(',');
  if (knowledgeArray.length === 415) {
    return {
      hasLeveledUp: false,
      totalLevelExperience: 0,
      level: level,
      experience: experience,
      newMetaData: metadata,
      gainedExperience: 0,
      limit: true,
    };
  }
  const gainedExperience = calculateExperienceGained({ notes, knowledgeArray });
  const newMetaData = await createMonsterMetaData({
    metadata,
    noteTitles,
    essayTitle: essayObject.title,
    essayMainIdea: essayObject.mainIdea,
  });

  noteTitles = noteTitles.map((note) => note.toLowerCase());
  const newKnowledge = [...new Set([...noteTitles, ...knowledgeArray])].join(
    ','
  );

  const sumExperience = gainedExperience + experience;
  const totalLevelExperience = level * 200 + 100;
  const hasLeveledUp = sumExperience > totalLevelExperience && level !== 10;

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
    newLevel: level !== 10 ? level + 1 : level,
    experience,
    newMetaData,
    gainedExperience,
    limit: false,
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
        .setDescription(
          'Input the titles of your notes like this: /essay MainIdea, SupportingIdea, SupportingIdea'
        )
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
      console.log('currentEssaySkeleton123', currentEssaySkeleton);
      const essayTitleAndText = currentEssaySkeleton(
        topics[0],
        topics[1],
        topics[2]
      );
      console.log(
        `essayCreation(
          essayTitleAndText.title + '\n\n' + essayTitleAndText.text
        )`,
        essayCreation(essayTitleAndText.title + '\n\n' + essayTitleAndText.text)
      );
      const response = await client.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0.05,
        n: 1,
        messages: essayCreation(
          essayTitleAndText.title + '\n\n' + essayTitleAndText.text
        ),
      });

      console.log('response123', response?.data.choices[0].message);
      const essayObject = parseEssay(response?.data.choices[0].message.content);

      await interaction.editReply({
        embeds: [
          {
            title: essayObject.title,
            description: essayObject.essay,
            color: 14588438,
          },
        ],
      });

      const noteIds = notes.map((note) => note.id);

      const {
        hasLeveledUp,
        totalLevelExperience,
        newLevel,
        experience,
        gainedExperience,
        limit,
      } = await handleMonsterExperience({
        interaction,
        noteTitles,
        essayObject,
        notes,
      });

      await createEssay({
        user: interaction.user,
        text: essayObject.essay,
        title: essayObject.title,
        category: topics[0].category,
      });
      await deleteNotes(interaction.user, noteIds);
      // if (limit && level === 10) {
      //   await interaction.followUp(
      //     `What a fantastic essay! However, I can not possibly learn any more! I am at my limit!`
      //   );
      // } else if (limit && level !== 10) {
      //   await interaction.followUp(
      //     `What a great essay! However I have reached my limit and can not learn or gain any more experience! Maybe I should had studied harder!`
      //   );
      // } else
      if (hasLeveledUp) {
        await interaction.followUp(
          `Oh wow you leveled up to level ${newLevel} after gaining ${gainedExperience} experience! Also, I now know about ${combineSubjects(
            noteTitles
          )}!`
        );
      } else {
        await interaction.followUp(
          `What a fantastic essay! I now know about ${combineSubjects(
            noteTitles
          )} and have gained ${gainedExperience} experience! ${
            totalLevelExperience - (gainedExperience + experience)
          } more experience points until I level up to level ${newLevel}!`
        );
      }

      if (hasLeveledUp && (newLevel % 2 !== 0 || newLevel === 10)) {
        essayObject.category = topics[0].category;
        const letter = letters[newLevel]({
          essay: essayObject,
          type: 'Banana',
        });
        await interaction.followUp(
          letters.monsterLetterFollowUpIntro[newLevel]
        );
        await interaction.followUp(letter);
        await interaction.followUp(
          letters.monsterLetterFollowUpResponse[newLevel]
        );
      } else {
        await interaction.followUp(
          `Wow! I really hope my essay ${
            essayObject.title
          } has a positive impact on the monster community! ${removeLastPunctuation(
            essayObject.mainIdea
          )} is such an interesting concept!`
        );
      }
    } catch (e) {
      console.log(e);
    }
  },
};
