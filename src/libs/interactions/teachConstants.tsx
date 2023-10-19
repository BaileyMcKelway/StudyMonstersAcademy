export const teachingEndings = (subject: string) => {
  const teachingEndingsString = [
    `Wow cool! Thanks for teaching me about ${subject}! I'll add it to my notes and study them some more! Once I have 3 notes, I can write an essay and add ${subject} to my knowledge!`,
    `So interesting! I'll add ${subject} to my notes. I can write an essay about ${subject} once I have 3 notes and then I'll add it to my knowledge.`,
    `You're so smart! Thank you for teaching me! I'll add ${subject} to my notes. I can write an essay about ${subject} once I have 3 notes!`,
    `I look forward to writing an essay about this! I'll study ${subject} some more in the meantime!`,
  ];

  return teachingEndingsString[
    Math.floor(Math.random() * teachingEndingsString.length)
  ];
};
