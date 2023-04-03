const historyAndPolitics = (topicA, topicB, topicC) => {
  const historyAndPoliticsEssays = [
    `The impact of ${topicA.subject} on ${topicB.subject} and ${topicC.subject}.`,
    `The Rise and Fall of ${topicA.subject} and its Impact on ${topicB.subject} and ${topicC.subject}`,
    `The ${topicA.subject} and its Significance in ${topicB.subject} and ${topicC.subject}`,
    `The Legacy of ${topicA.subject} in ${topicB.subject} and ${topicC.subject}`,
    `The Relevance of ${topicA.subject} in ${topicB.subject} and ${topicC.subject}`,
    `The Emergence and Development of ${topicA.subject} regarding ${topicB.subject} and ${topicC.subject}`,
    `Was ${topicA.subject} beneficial or detrimental to ${topicB.subject} and ${topicC.subject}?`,
    `Was the ${topicA.subject} more beneficial than harmful to ${topicB.subject} or ${topicC.subject}?`,
  ];
  return historyAndPoliticsEssays[
    Math.floor(Math.random() * historyAndPoliticsEssays.length)
  ];
};

const scienceAndTechnology = (topicA, topicB, topicC) => {
  const scienceAndTechnologyEssays = [
    `The Future of ${topicA.subject}: Emerging ${topicB.subject} and Implications for ${topicC.subject}`,
    `The Ethical Implications of Artificial Intelligence`,
    'The Developments in Biotechnology and their Implications for the Future',
    `The Possibilities of Space Colonization`,
    `The Contributions of Women in Science and Technology`,
    `Is the use of ${topicA.subject} safe and beneficial, or should we move towards alternative ${topicB.subject} and ${topicC.subject}?`,
    `Is the development of ${topicA.subject} a threat to ${topicB.subject} and the ${topicC.subject}?`,
    `Is the ${topicA.subject} a positive or negative influence on ${topicB.subject} and ${topicC.subject}?`,
  ];
  return scienceAndTechnologyEssays[
    Math.floor(Math.random() * scienceAndTechnologyEssays.length)
  ];
};

const artsAndHumanities = (topicA, topicB, topicC) => {
  const artsAndHumanitiesEssays = [
    `Portrayals of ${topicB.subject} in ${topicC.subject}: A Critique of ${topicA.subject}`,
    `In Search of ${topicA.subject}: The Emergence of ${topicB.subject} and ${topicC.subject}`,
    `${topicA.subject} as a Reflection of ${topicB.subject} and ${topicC.subject}`,
    `Investigating the Psychology of ${topicA.subject} in ${topicB.subject} and ${topicC.subject}`,
    `Exploring the Relationship between ${topicB.subject} and ${topicC.subject} in ${topicA.subject}`,
    `The Intersection of ${topicA.subject}, ${topicB.subject} and ${topicC.subject}`,
  ];
  return artsAndHumanitiesEssays[
    Math.floor(Math.random() * artsAndHumanitiesEssays.length)
  ];
};

const celebrities = (topicA, topicB, topicC) => {
  const celebritiesEssays = [
    `The History and Significance of ${topicA.subject} and ${topicB.subject} in Different ${topicC.subject}`,
    `From ${topicB.subject} to ${topicC.subject}: The Evolution of ${topicA.subject}`,
    `Why ${topicA.subject} love for ${topicB.subject} is more important than ${topicC.subject}`,
    `The Hidden Connection Between ${topicA.subject}, ${topicB.subject}, and ${topicC.subject}`,
    `The Connection Between ${topicA.subject}, ${topicB.subject} and ${topicC.subject}`,
    `The Influence of ${topicA.subject} on ${topicB.subject} and ${topicC.subject}`,
  ];
  return celebritiesEssays[
    Math.floor(Math.random() * celebritiesEssays.length)
  ];
};

const businessAndEconomics = (topicA, topicB, topicC) => {
  const businessAndEconomicsEssays = [
    `The future of ${topicA.subject}: ${topicB.subject} vs. ${topicC.subject}`,
    `The Impact of ${topicA.subject} on ${topicB.subject} and ${topicC.subject}`,
    `The Importance of ${topicA.subject} in ${topicB.subject} and ${topicC.subject}`,
    `The Econmics of ${topicA.subject}: ${topicB.subject} vs. ${topicC.subject}`,
    `The Role of ${topicA.subject} in ${topicB.subject} and ${topicC.subject}`,
  ];
  return businessAndEconomicsEssays[
    Math.floor(Math.random() * businessAndEconomicsEssays.length)
  ];
};

const educationAndPedagogy = (topicA, topicB, topicC) => {
  const educationAndPedagogyEssays = [
    `The Importance of ${topicC.subject} in ${topicA.subject} and ${topicB.subject}`,
    `The Need for ${topicC.subject} in ${topicA.subject} and ${topicB.subject}`,
    `Should ${topicA.subject} be Mandatory? An Argument for ${topicB.subject} and ${topicC.subject}`,
    `Why ${topicA.subject} is the Key to ${topicB.subject} and ${topicC.subject}`,
  ];
  return educationAndPedagogyEssays[
    Math.floor(Math.random() * educationAndPedagogyEssays.length)
  ];
};

const healthAndMedicine = (topicA, topicB, topicC) => {
  const healthAndMedicineEssays = [
    `The Ethics of ${topicA.subject}: Should We Screen for ${topicB.subject} and ${topicC.subject}?`,
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
    `${topicA.subject} and Its Impact on ${topicB.subject} and ${topicC.subject}`,
  ];
  return environmentAndSustainabilityEssays[
    Math.floor(Math.random() * environmentAndSustainabilityEssays.length)
  ];
};

const sportsAndRecreation = (topicA, topicB, topicC) => {
  const sportsAndRecreationEssays = [
    `The Psychology of ${topicA.subject}: How ${topicB.subject} Stay Motivated and Focused with ${topicC.subject}`,
    `${topicA.subject} and ${topicB.subject}: How ${topicA.subject} Can Bridge ${topicC.subject}`,
    `The Culture of ${topicA.subject}: How ${topicB.subject} Reflect ${topicC.subject} Values and Beliefs`,
    `The History of the ${topicA.subject}: A Look Back at ${topicA.subject} effect on ${topicB.subject} and ${topicC.subject}`,
    `The Economics of ${topicA.subject}: The Costs and Benefits of ${topicB.subject} and ${topicC.subject}`,
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
  'Science and Technology': scienceAndTechnology,
  'Arts And Humanities': artsAndHumanities,
  Celebrities: celebrities,
  'Business And Economics': businessAndEconomics,
  'Education And Pedagogy': educationAndPedagogy,
  'Health And Medicine': healthAndMedicine,
  'Environment And Sustainability': environmentAndSustainability,
  'Sports And Recreation': sportsAndRecreation,
  'Religion And Spirituality': religionAndSpirituality,
  default: historyAndPolitics,
};
