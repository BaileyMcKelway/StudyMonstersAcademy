export const essayFillers = (topicA: string, topicB: string) => {
  const essayMiddleString = [
    `Oh wow I am making a lot of connections between ${topicA} and ${topicB}!`,
    `Hmm yes I see the connection between ${topicA} and ${topicB}!`,
    `${topicA} and ${topicB} have so much in common!`,
    `Wait are ${topicA} and ${topicB} related? Ah who cares!`,
    `Are ${topicA} and ${topicB} related? Ah whatever!`,
  ];

  const essayEndingString = [
    'I can tell this is going to be a good essay! One sec...',
    `This is some of my best work! Just need to write a little bit more...`,
    `This is gonna be good. This essay is bulletproof!`,
    `Oh no! Wait... Eh it will be fine...`,
  ];

  const essayAllDoneString = [
    'All done!',
    "Alright, I'm done!",
    'Here it is!',
    "Here's my essay!",
  ];

  return {
    essayMiddleString:
      essayMiddleString[Math.floor(Math.random() * essayMiddleString.length)],
    essayEndingString:
      essayEndingString[Math.floor(Math.random() * essayEndingString.length)],
    essayAllDoneString:
      essayAllDoneString[Math.floor(Math.random() * essayAllDoneString.length)],
  };
};
