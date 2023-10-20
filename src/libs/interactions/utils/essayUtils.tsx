import { updateMonster, getNotes } from '../../database/utils';
import letters from '../../letters/constants';
import { TYPE } from '../../global';

export const removeLastPunctuation = (str: string) => {
  if (/[.,\/#!$%\^&\*;:{}=\-_`~()]/.test(str.slice(-1))) {
    str = str.slice(0, -1);
  }
  return str;
};

export const combineSubjects = (subjects: string[]) => {
  const lastWord = subjects.pop();
  return subjects.join(', ') + ', and ' + lastWord;
};

export const calculateExperienceGained = ({ notes }: { notes: any[] }) => {
  const avgQuality =
    notes.reduce((acc, curr) => {
      return acc + curr.quality / 100;
    }, 0) / notes.length;

  return Math.floor(avgQuality * 100);
};

export const createMonsterMetaData = async ({
  metadata,
  essayTitle,
  essayMainIdea,
  notes,
}) => {
  const parsedMetaData = await JSON.parse(metadata);
  parsedMetaData[notes[0].subject.toLowerCase()] = {
    title: essayTitle,
    mainIdea: essayMainIdea,
    notes: notes[0].ideas.replace('$$', ' Pretend you believe '),
  };
  parsedMetaData[notes[1].subject.toLowerCase()] = {
    title: essayTitle,
    mainIdea: essayMainIdea,
    notes: notes[1].ideas.replace('$$', ' Pretend you believe '),
  };
  parsedMetaData[notes[2].subject.toLowerCase()] = {
    title: essayTitle,
    mainIdea: essayMainIdea,
    notes: notes[2].ideas.replace('$$', ' Pretend you believe '),
  };
  return parsedMetaData;
};

export const handleMonsterExperience = async ({
  monster,
  interaction,
  noteTitles,
  essayObject,
  notes,
}) => {
  let { level, experience, knowledge, metadata } = monster;

  const knowledgeArray = knowledge.split(',');

  const gainedExperience = calculateExperienceGained({ notes });
  if (knowledgeArray.length < 150) {
    metadata = await createMonsterMetaData({
      metadata,
      essayTitle: essayObject?.title,
      essayMainIdea: essayObject?.mainIdea,
      notes,
    });
  }

  noteTitles = noteTitles.map((note) => note.toLowerCase());
  const newKnowledge = [...new Set([...noteTitles, ...knowledgeArray])].join(
    ','
  );

  const sumExperience = gainedExperience + experience;
  const totalLevelExperience = level * 100 + 100;
  const hasLeveledUp = sumExperience > totalLevelExperience && level !== 10;

  await updateMonster({
    user: interaction.user,
    exp: hasLeveledUp
      ? sumExperience - totalLevelExperience
      : level >= 10
      ? 0
      : sumExperience,
    level,
    hasLeveledUp,
    newKnowledge,
    newMetaData: metadata,
  });

  return {
    hasLeveledUp,
    totalLevelExperience,
    newLevel: level !== 10 ? level + 1 : level,
    experience,
    newMetaData: metadata,
    gainedExperience,
    limit: knowledgeArray.length >= 150,
  };
};

export const cleanNoteTitles = (interaction) => {
  const noteTitles = interaction.options.getString('essay_input').split(',');
  return noteTitles.map((str) => {
    if (typeof str === 'string') {
      return str.trim().slice(0, 1) === ' ' ? str.trim().slice(1) : str.trim();
    } else {
      return str;
    }
  });
};

export const createNotesArray = (notes, mainNote) => {
  notes = notes.map((note) => note.dataValues);
  const mainNoteObject = notes.find((note) => note.subject === mainNote);
  const otherNotes = notes.filter((note) => note.id !== mainNoteObject.id);
  return [mainNoteObject, ...otherNotes];
};

export const handleTopics = ({ notes }) => {
  return notes.map((note) => {
    const ideas = note?.ideas.split('$$');
    const noteObject = {
      subject: note?.subject.toLowerCase(),
      category: note?.category,
      ideaA: ideas.length !== 2 ? '' : ideas[0],
      ideaB: ideas.length !== 2 ? '' : ideas[1],
    };
    return noteObject;
  });
};

export const parseEssay = ({ inputString, monster, subject }) => {
  const lines = inputString.split('\n');
  const result = {
    title: '',
    essay: '',
    mainIdea: '',
    category: '',
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
  if (monster.level === 1) {
    result.mainIdea = `You believe that your new knowledge of ${subject}, combined with your passion for roller skating, will help your get into Monster Academy, which is the most prestigious academy in all of Monster Town!`;
  }

  return result;
};

export const validateNoteTitles = (noteTitles) => {
  if (noteTitles.length > 3) {
    return { isValid: false, error: 'You entered too many notes!' };
  } else if (noteTitles.length < 3) {
    return {
      isValid: false,
      error: 'You did not enter enough notes for me to create an essay!',
    };
  }
  return { isValid: true };
};

export const fetchNotes = async (user, noteTitles) => {
  let notes = await getNotes(user, noteTitles);
  if (!notes || notes.length < 3) {
    return {
      notes: [],
      success: false,
      error: 'Hmmm looks like one of the notes is missing',
    };
  }
  return { success: true, notes };
};

export const rearrangeNotesForFirstEssay = (notes, isFirstEssay, TYPE) => {
  if (!isFirstEssay) {
    return notes;
  }

  const MONSTER_ACADEMY = 'Monster Academy';

  const monsterNote = notes.find((note) => note.subject === TYPE);
  const monsterAcademyNote = notes.find(
    (note) => note.subject === MONSTER_ACADEMY
  );
  const otherNote = notes.find(
    (note) => note.subject !== MONSTER_ACADEMY && note.subject !== TYPE
  );

  if (!monsterNote || !monsterAcademyNote || !otherNote) {
    return notes;
  }

  return [monsterNote, monsterAcademyNote, otherNote];
};

export const handleLevelUpNotification = async ({
  hasLeveledUp,
  limit,
  noteTitles,
  newLevel,
  gainedExperience,
  totalLevelExperience,
  experience,
  interaction,
}) => {
  let message;

  if (hasLeveledUp) {
    const knowledgeStatement = limit
      ? ''
      : ` Also, I now know about ${combineSubjects(noteTitles)}!`;
    message = `Oh wow you leveled up to level ${newLevel} after gaining ${gainedExperience} experience!${knowledgeStatement}`;
  } else {
    const knowledgeStatement = limit
      ? ''
      : ` I now know about ${combineSubjects(noteTitles)}`;
    message = `What a fantastic essay!${knowledgeStatement}. Also, I have gained ${gainedExperience} experience! ${
      totalLevelExperience - (gainedExperience + experience)
    } more experience points until I level up to level ${newLevel}!`;
  }

  setTimeout(async () => {
    await interaction.followUp(message);
  }, 2000);
};

export const sendLevelUpMessages = async ({
  hasLeveledUp,
  newLevel,
  monster,
  essayObject,
  topics,
  interaction,
}) => {
  const delayFollowUp = async (message, delay) => {
    setTimeout(async () => {
      await interaction.followUp(message);
    }, delay);
  };

  if (hasLeveledUp && (newLevel % 2 !== 0 || newLevel === 10)) {
    essayObject.category = topics[0].category;
    const letter = letters[newLevel]({
      essay: essayObject,
      type: TYPE,
    });
    await delayFollowUp(letters.monsterLetterFollowUpIntro[newLevel], 2500);
    await delayFollowUp(letter, 2700);
    await delayFollowUp(letters.monsterLetterFollowUpResponse[newLevel], 3000);
  } else {
    if (monster.level === 1) {
      const firstEssayMessage = `😄🥳 Awesome! My first essay! Thank you so much for helping me out! I can not wait to learn more from you! "${essayObject.title}" will definitely get the attention of the folks at Monster Academy! I believe that my new knowledge of ${topics[2].subject}, combined with my passion for roller skating, will help me get into Monster Academy, which is the most prestigious academy in all of Monster Town!`;
      await delayFollowUp(firstEssayMessage, 2500);
    } else {
      const regularMessage = `Wow! I really hope my essay "${
        essayObject.title
      }" has a positive impact on the monster community! ${removeLastPunctuation(
        essayObject.mainIdea
      )} is such an interesting concept!`;
      await delayFollowUp(regularMessage, 2500);
    }
  }
};
