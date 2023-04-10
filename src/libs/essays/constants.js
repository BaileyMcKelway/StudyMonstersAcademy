const historyAndPolitics = (topicA, topicB, topicC) => {
  const historyAndPoliticsEssays = [
    {
      title: `The Rise and Fall of ${topicA.subject} and its Impact on ${topicB.subject} and ${topicC.subject}`,
      text: `During the 21 century ${topicA.subject} has had many ups and downs and this impacts ${topicB.subject} and ${topicC.subject} in a major way! ${topicB.ideaA} and they wouldn't be that way if it wasn't for ${topicA.subject}. Also, because ${topicA.ideaB} ${topicC.subject} were never the same. ${topicA.subject} has had a major impact on ${topicB.subject} and ${topicC.subject} over the years and it's important to understand how it has affected them.`,
    },
    {
      title: `The ${topicA.subject} and its Significance in ${topicB.subject} and ${topicC.subject}`,
      text: `The significance of ${topicA.subject} in ${topicB.subject} and ${topicC.subject} is undeniable. ${topicA.subject} has had a major impact on ${topicB.subject} and ${topicC.subject} over the years and it's important to understand how it has affected them. This is due largely to ${topicA.ideaB}. Many experts believe ${topicB.subject} would not ${topicB.ideaB} if it were not for ${topicA.subject}`,
    },
    {
      title: `The Legacy of ${topicA.subject} in ${topicB.subject} and ${topicC.subject}`,
      text: `George Washington once said "Legacies are super important." and this could not be more relevant to ${topicA.subject} legacy in ${topicB.subject} and ${topicC.subject}. Because of ${topicA.ideaA}, ${topicB.ideaB}. This is why ${topicA.subject} is so important to ${topicB.subject} and ${topicC.subject}.`,
    },
    {
      title: `The Relevance of ${topicA.subject} in ${topicB.subject} and ${topicC.subject}`,
      text: `${topicA.subject}, ${topicB.subject}, and ${topicC.subject} are all very relevant to one another but there are some who deny this! Naysayers say that ${topicA.subject} is not relevant to ${topicB.subject} and ${topicC.subject} but this is not true. It takes a turn expert such as myself to see that the fact ${topicA.ideaB} is relevant to ${topicB.subject} and ${topicC.subject}. Only time will show these naysayers to be wrong!`,
    },
  ];
  return historyAndPoliticsEssays[
    Math.floor(Math.random() * historyAndPoliticsEssays.length)
  ];
};

const scienceAndTechnology = (topicA, topicB, topicC) => {
  const scienceAndTechnologyEssays = [
    {
      title: `The Future of ${topicA.subject}: Emerging ${topicB.subject} and Implications for ${topicC.subject}`,
      text: `The future of ${topicA.subject} is looking increasingly promising, with emerging ${topicB.subject} set to revolutionize the ${topicC.subject} industry. One of the most exciting developments is ${topicA.ideaA}. With more and more ${topicB.subject}, ${topicC.subject} is going to have a hard time. This is all because ${topicA.ideaB}. Only time will tell what is to hold for ${topicA.subject}, ${topicB.subject}, and ${topicC.subject}.`,
    },
    {
      title: `Is the development of ${topicA.subject} a threat to ${topicB.subject} and ${topicC.subject}?`,
      text: `The development of ${topicA.subject} is a rapidly advancing field with the potential to change the ${topicB.subject} and ${topicC.subject}. However, as with any technological advancement, it is important to consider the potential threats and ethical implications that come with it. One concern is ${topicA.ideaB}. What is it's impact on ${topicB.subject} and ${topicC.subject}? It is crucial that we prioritize human safety and ethical considerations when developing ${topicA.subject}.`,
    },
    {
      title: `Is the ${topicA.subject} a positive or negative influence on ${topicB.subject} and ${topicC.subject}?`,
      text: `The development of ${topicA.subject} has been one of the most significant technological advancements of our time, but what is it's influence on ${topicB.subject} and ${topicC.subject}? Maybe experts say because ${topicA.ideaA} there will be a positive influence on ${topicB.subject} and ${topicC.subject}. However, others say otherwise are there could be drastic negative effects. Overall, the impact of ${topicA.subject} on ${topicB.subject} and ${topicC.subject} is complex and multifaceted.`,
    },
  ];

  return scienceAndTechnologyEssays[
    Math.floor(Math.random() * scienceAndTechnologyEssays.length)
  ];
};

const artsAndHumanities = (topicA, topicB, topicC) => {
  const artsAndHumanitiesEssays = [
    {
      title: `Portrayals of ${topicB.subject} and ${topicC.subject} in ${topicA.subject}`,
      text: `The portrayal of ${topicB.subject} and ${topicC.subject} in ${topicA.subject} has been a topic of discussion for many years, with ${topicC.subject} being a central focus. In many works of ${topicA.subject}, ${topicB.subject} have been depicted in various ways. This has led to criticism of ${topicB.subject} that are perpetuated in ${topicA.subject}. HOwever, if it wasn't for the fact that ${topicC.ideaB} no one would talk about it at all. Overall, the portrayal of ${topicB.subject} and ${topicC.subject} in ${topicA.subject} is an important reflection of societal norms and has the potential to shape many attitudes.`,
    },
    {
      title: `In Search of ${topicA.subject}: The Emergence of ${topicB.subject} and ${topicC.subject}`,
      text: `${topicA.subject} is a reflection of society and its values. The emergence of ${topicB.subject} and ${topicC.subject} has led to a new wave of ${topicA.subject}. Leading figures in the art world say this is because ${topicA.ideaB}. However, others say that because ${topicB.ideaA} there has been much change. Overall, the emergence of ${topicB.subject} and ${topicC.subject} has led to a new wave of ${topicA.subject} that has left the art world in shambles.`,
    },
    {
      title: `Exploring the Relationship between ${topicB.subject} and ${topicC.subject} in ${topicA.subject}`,
      text: `${topicA.subject} has become a space for artists to explore ${topicB.subject} and ${topicC.subject}. Artist are drawn to it because ${topicA.ideaA}. The relationship between ${topicB.subject} and ${topicC.subject} is complex and multifacted. This is because ${topicC.ideaA}. Artist continue to explore this relationship and it's impact on ${topicA.subject}.`,
    },
  ];

  return artsAndHumanitiesEssays[
    Math.floor(Math.random() * artsAndHumanitiesEssays.length)
  ];
};

const celebrity = (topicA, topicB, topicC) => {
  const celebritiesEssays = [
    {
      title: `From ${topicB.subject} to ${topicC.subject}: The Evolution of ${topicA.subject}`,
      text: `The evolution of ${topicA.subject} has had the United States on the edges of their seats. From ${topicB.subject} to ${topicC.subject}, ${topicA.subject} has been a topic of discussion for many years. Becuase of ${topicC.ideaB} many folks are wondering what will happen next! ${topicA.subject} is not short on surprises and it's hard to predict what will happen next!`,
    },
    {
      title: `Why ${topicA.subject}'s love for ${topicB.subject} is more important than ${topicC.subject}`,
      text: `${topicA.subject} importance to ${topicC.subject} is widely recognized, but the love for ${topicB.subject} is much more important. ${topicA.subject} love for ${topicB.subject} can not be understated and this is all because ${topicB.ideaA}. This is true even if ${topicB.ideaA}. We should all be grateful for ${topicA.subject}'s love for ${topicB.subject}!`,
    },
  ];

  return celebritiesEssays[
    Math.floor(Math.random() * celebritiesEssays.length)
  ];
};

const businessAndEconomics = (topicA, topicB, topicC) => {
  const businessAndEconomicsEssays = [
    {
      title: `From ${topicB.subject} to ${topicC.subject}: The Evolution of ${topicA.subject}`,
      text: `The evolution of ${topicA.subject} has had the United States on the edges of their seats. From ${topicB.subject} to ${topicC.subject}, ${topicA.subject} has been a topic of discussion for many years. Because of ${topicC.ideaB} many folks are wondering what will happen next! ${topicA.subject} is not short on surprises and it's hard to predict what will happen next!`,
    },
  ];
  // `The Importance of ${topicA.subject} in ${topicB.subject} and ${topicC.subject}`,
  //   `The Econmics of ${topicA.subject}: ${topicB.subject} vs. ${topicC.subject}`,
  //   `The Role of ${topicA.subject} in ${topicB.subject} and ${topicC.subject}`,
  return businessAndEconomicsEssays[
    Math.floor(Math.random() * businessAndEconomicsEssays.length)
  ];
};

const educationAndPedagogy = (topicA, topicB, topicC) => {
  const educationAndPedagogyEssays = [
    `The Need for ${topicC.subject} in ${topicA.subject} and ${topicB.subject}`,
    `Should ${topicA.subject} be Mandatory? An Argument for ${topicB.subject} and ${topicC.subject}`,
  ];
  return educationAndPedagogyEssays[
    Math.floor(Math.random() * educationAndPedagogyEssays.length)
  ];
};

const healthAndMedicine = (topicA, topicB, topicC) => {
  const healthAndMedicineEssays = [
    `The Pros and Cons of ${topicA.subject}: Is it the Solution for ${topicB.subject} and  ${topicC.subject}?`,
    `The Stigma of ${topicA.subject}: Why We Need to Talk More About ${topicB.subject} and ${topicC.subject}`,
    `The Debate on ${topicA.subject}: An Argument for ${topicB.subject} and ${topicC.subject}`,
  ];
  return healthAndMedicineEssays[
    Math.floor(Math.random() * healthAndMedicineEssays.length)
  ];
};

const environmentAndSustainability = (topicA, topicB, topicC) => {
  const environmentAndSustainabilityEssays = [
    `${topicA.subject} and Its Effects on ${topicB.subject} and ${topicC.subject}`,
    `The Ethics of ${topicA.subject} in ${topicB.subject} and ${topicC.subject}`,
    `The Need for ${topicA.subject} to Combat ${topicB.subject} and ${topicC.subject}`,
  ];
  return environmentAndSustainabilityEssays[
    Math.floor(Math.random() * environmentAndSustainabilityEssays.length)
  ];
};

const sportsAndRecreation = (topicA, topicB, topicC) => {
  const sportsAndRecreationEssays = [
    `The Psychology of ${topicA.subject}: How ${topicB.subject} Stay Motivated and Focused with ${topicC.subject}`,
    `The Culture of ${topicA.subject}: How ${topicB.subject} Reflect ${topicC.subject} Values and Beliefs`,
    `The History of the ${topicA.subject}: A Look Back at ${topicA.subject} effect on ${topicB.subject} and ${topicC.subject}`,
  ];
  return sportsAndRecreationEssays[
    Math.floor(Math.random() * sportsAndRecreationEssays.length)
  ];
};

const religionAndSpirituality = (topicA, topicB, topicC) => {
  return `The Controversy Surrounding ${topicA.subject} and ${topicB.subject}`;
};

module.exports = {
  'History And Politics': historyAndPolitics,
  'Science And Technology': scienceAndTechnology,
  'Arts And Humanities': artsAndHumanities,
  Celebrity: celebrity,
  'Business And Economics': businessAndEconomics,
  'Education And Pedagogy': educationAndPedagogy,
  'Health And Medicine': healthAndMedicine,
  'Environment And Sustainability': environmentAndSustainability,
  'Sports And Recreation': sportsAndRecreation,
  'Religion And Spirituality': religionAndSpirituality,
  default: historyAndPolitics,
};
