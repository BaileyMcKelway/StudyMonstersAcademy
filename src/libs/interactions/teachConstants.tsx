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

export const gameIntro =
  'Hi! 👋 Thank you for choosing me! This is very exciting!\n\nMy name is Banana, and all I want to do is learn, and you are going to teach me! If I learn a lot, maybe I’ll get into Monster Academy!📚\n\nCurrently, I don’t know much about anything except for roller skating 🛼, which is my favorite thing to do. So, if you try to talk to me about a subject, I won’t have much to say. Can you teach me something new?\n\nYou can teach me something using the `/teach` command.\n Type `/teach`, and then enter everything you want me to know about one subject. I’ll study that information and then create a **note** about that subject!📝 I may have a few questions, though...\n\nI already have two **notes** created! One is all about me, and the other is about Monster Academy! \n-Type `/lookup notes` to view my notes\n\nOnce I have three **notes**, I can then write an **essay**!\n-Type `/essay` and enter the titles of the three **notes**\n-The main subject goes first, followed by the two supporting subjects.\n-Like this: `Main Subject, Supporting Subject A, Supporting Subject B`\n\nOnce I write an **essay**, I’ll learn those three things! Then we can talk about them! 😄';
