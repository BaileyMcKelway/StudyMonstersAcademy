const levelThreeKiwanoLetter = ({ essay, type }) =>
  `
✉️ ✉️ ✉️
*Dear ${type},

I am writing to you in my capacity as the Head of the Executive Committee of Monster Academy. Though we have not yet had the pleasure of a personal introduction, it is with great admiration and respect that I write to you today.

Your paper on "${essay.title}" has been making waves in academia and many important monsters have taken note. Our ${essay.category} Department at Monster Academy has made significant advancements on their research all thanks to your essay.

As a leading institution in the field of monster education, Monster Academy places great value on the work of scholars and researchers such as yourself. We are committed to fostering a culture of excellence and innovation, and we recognize the vital role that research plays in advancing our understanding of the monster world.

Please know that from now on we will be following your work much more closely and we look forward to all the research you will be doing in the future.

Sincerely,

Dr. Kiwano
Head of the Executive Committee of Monster Academy*
✉️ ✉️ ✉️
`;
const levelFiveKiwanoLetter = ({ essay, type }) =>
  `
✉️ ✉️ ✉️
  *Dear ${type},

  I hope this letter finds you in excellent health and prosperous spirits. As the esteemed Head of the Executive Committee of Monster Academy, I humbly write to you once again to express my deepest admiration for the significant papers you have authored in the field of monster studies. Your diligent work is a beacon of inspiration and a testament to your remarkable intellect.
  
  Once again, one of your essays has been a guiding source of truth in the field of ${essay.category.toLowerCase()}. Our ${
    essay.category
  } department has made groundbreaking discoveries thanks to your essay, "${
    essay.title
  }". It is a true testament to your exceptional intellect and unwavering dedication to your studies.
  
  Your work is now being taught in every undergraduate and graduate course. It is the least we can do! Your contributions have undoubtedly had a profound impact on the academic community, and we are honored to have your work as a cornerstone of our curriculum.
  
  With sincere appreciation and respect,
  
  Dr. Kiwano
  Head of the Executive Committee of Monster Academy*
✉️ ✉️ ✉️
`;
const levelSevenKiwanoLetter = ({ essay, type }) =>
  `
✉️ ✉️ ✉️
  *Dear ${type},

  I hope this letter finds you in good spirits. As always, it has been a pleasure to follow your work and to see the impact you are making in the field of monster studies. You are the Aristotle, Leonardo da Vinci, and Isaac Newton of our time, and your essays are historic.
  
  As the Head of the Executive Committee of Monster Academy, I am writing to you again to express my admiration for the important papers you have produced. Your paper, "${essay.title}" has been added to our libraries to be studied by future generations.
  
  While I do not wish to be forward, I must add that our institution has a reputation for attracting the brightest minds in the field. As such, we believe that you would find a stimulating intellectual community and ample opportunities for further research and collaboration here at Monster Academy. Even though you are only 450 monster years old, rules can be bent, and there is a possibility that someone as young as yourself can join our ranks. It is something to keep in mind.
  
  Sincerely,
  
  Dr. Kiwano
  Head of the Executive Committee of Monster Academy*
✉️ ✉️ ✉️
`;
const levelNineKiwanoLetter = ({ essay, type }) =>
  `
✉️ ✉️ ✉️
  *Dear ${type},

  I am writing to you once again to express my deepest appreciation for the countless essays you have written. It is without a doubt that your hard work and dedication to our mission are some of the most influential aspects of the Monster Academy.
  
  Honestly, I find myself reading your essays with my mouth agape in awe at your logic and reasoning. Often times I daydream about what type of monster could hold such a vast array of ideas.
  
  Take for instance your recent essay, "${
    essay.title
  }." Your ability to explain the complexities of ${essay.category.toLowerCase()} is extraordinary.
  
  Also, I wanted to inform you that I will be putting all of my focus into getting you into Monster Academy. Who cares if you are only 450 monster years old? We need your brilliance here in the halls of Monster Academy! I will have to bring this up to the board, so I cannot say for certain that things will work out in your favor, but I will try my best!
  
  Sincerely,
  
  Dr. Kiwano
  Head of the Executive Committee of Monster Academy*
✉️ ✉️ ✉️
`;
const levelTenKiwanoLetter = ({ type }) =>
  `
✉️ ✉️ ✉️
  *${type}!,

  I have great news! The board has voted on whether to enroll you at Monster Academy and the decision was a resounding “YES!” Congratulations, you are now officially a student at Monster Academy!
  
  You have been chosen for your outstanding achievements in the field of monster excellence. Your hard work and dedication have made you the perfect candidate for this esteemed institution. With your leadership, you will be bringing a wealth of experience and knowledge to our university.
  
  Thank you for your commitment to excellence, and we look forward to your participation at Monster Academy!
  
  Sincerely,
  
  Dr. Kiwano
  Head of the Executive Committee of Monster Academy*
✉️ ✉️ ✉️
`;

const monsterLetterFollowUpIntro = {
  3: `Wait a second what is this? I just recieved a letter in the mail from someone named Dr. Kiwano. Hmm let me read it...`,
  5: `Also what is this? A letter just arrived! It's from Dr. Kiwano again! He's the Head of the Executive Committee of Monster Academy!`,
  7: `Oh cool! I just got a letter from Dr. Kiwano! Let me read it...`,
  9: `Hey look! Another letter from Dr. Kiwano! I wonder what he wants this time...`,
  10: `Oh boy a letter just arrived! This one is important! Will I get in to Monster Academy? Let's find out!`,
};

const monsterLetterFollowUpResponse = {
  3: `Wow this Kiwano guy sounds important! And it is so cool that my essays are having a positive effect on the monster world!`,
  5: `Yup! That essay was some of my best work! I am glad it had such a positive effect at Monster Academy!`,
  7: `That is so exciting! Maybe there is a chance I can get in to Monster Academy after all even though I am only 450 monster years old!`,
  9: `Dr. Kiwano sounds so impressed! I am a kinda nervous! I wonder what the board is going to say!`,
  10: `YIPPEE! This is the best news ever! I am so excited! This is all thanks to you! Thank you for teaching me so much!`,
};

module.exports = {
  3: levelThreeKiwanoLetter,
  5: levelFiveKiwanoLetter,
  7: levelSevenKiwanoLetter,
  9: levelNineKiwanoLetter,
  10: levelTenKiwanoLetter,
  monsterLetterFollowUpIntro,
  monsterLetterFollowUpResponse,
};
