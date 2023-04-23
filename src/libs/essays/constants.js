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
      text: `${topicA.subject}, ${topicB.subject}, and ${topicC.subject} are all very relevant to one another but there are some who deny this! Naysayers say that ${topicA.subject} is not relevant to ${topicB.subject} and ${topicC.subject} but this is not true. It takes a true expert such as myself to see that the fact, "${topicA.ideaB}" is relevant to ${topicB.subject} and ${topicC.subject}. Only time will show these naysayers to be wrong!`,
    },
    {
      title: `Why ${topicA.subject} Is More Important than ${topicB.subject} and ${topicC.subject}`,
      text: `${topicA.subject} is oftentimes considered more important than ${topicB.subject} and ${topicC.subject}. This is because ${topicA.ideaA}. Most people don't consider ${topicB.subject} important because ${topicB.ideaA}, which is so trival. As such, it is necessary to consider the importance of ${topicA.subject} in comparison to ${topicB.subject} and ${topicC.subject}.`,
    },
    {
      title: `${topicA.subject}: An Analysis of ${topicB.subject} and ${topicC.subject}`,
      text: `${topicA.subject} has had a major impact on ${topicB.subject} and ${topicC.subject}, and it is important to analyze that influence. In particular, ${topicA.ideaA} and it has made ${topicB.subject} more ${topicB.ideaA}. This can be seen in how ${topicC.subject} have been ${topicC.ideaA}. It is clear that understanding ${topicA.subject} has a major impact on ${topicB.subject} and ${topicC.subject}.`,
    },
    {
      title: `${topicA.subject}: A Historical Analysis of ${topicB.subject} and ${topicC.subject}`,
      text: `${topicA.subject} has been a prominent part of history for centuries, and it is important to understand what its influence has been on ${topicB.subject} and ${topicC.subject}. This is particularly true due to ${topicA.ideaA}, which has caused ${topicB.subject} to be ${topicB.ideaA}. As a result of this ${topicC.subject} has never been the same. Understanding the history of ${topicA.subject} is the only way to comprehend its effect on ${topicB.subject} and ${topicC.subject}.`,
    },
    {
      title: `The Dynamics of ${topicB.subject} and ${topicC.subject} in ${topicA.subject}`,
      text: `${topicA.subject} has always been dominated by the dynamics of ${topicB.subject} and ${topicC.subject}. This is in part due to ${topicA.ideaA}. It has also had a major impact on ${topicC.subject} and how  ${topicC.ideaA}. Understanding the dynamics of ${topicA.subject} is the only way to comprehend its effect on ${topicB.subject} and ${topicC.subject}.`,
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
    {
      title: `The Challenges of ${topicA.subject}: Protecting Against ${topicB.subject} and ${topicC.subject}`,
      text: `As ${topicA.subject} becomes increasingly prevalent, it is important to consider the challenges involved in protecting against ${topicB.subject} and ${topicC.subject}. One challenge is ${topicA.ideaA} which could lead to a potential security risk. Furthermore, with the growing popularity of ${topicB.subject} and ${topicC.subject}, it is becoming increasingly important to ensure that proper security measures are in place to protect against these threats. In order to address this growing concern, it is essential that we prioritize the safety and security of ${topicA.subject} moving forward.`,
    },
    {
      title: `How ${topicA.subject}, ${topicB.subject}, and ${topicC.subject} Are Changing the World`,
      text: `${topicA.subject}, ${topicB.subject}, and ${topicC.subject} are making a huge impact on the world. One reason is ${topicA.ideaA}. Additionally, ${topicB.subject} is revolutionizing the way we think about ${topicC.subject} largely due to ${topicB.ideaB}. All in all, ${topicA.subject}, ${topicB.subject}, and ${topicC.subject} are transforming the world in exciting and unprecedented ways.`,
    },
    {
      title: `The Ethics of ${topicA.subject}, ${topicB.subject}, and ${topicC.subject}`,
      text: `As the sophistication of ${topicA.subject}, ${topicB.subject}, and ${topicC.subject} increases, it is important to consider their ethical implications. One ethical concern is ${topicA.ideaA}. Furthermore, it is essential to consider the potential implications of ${topicB.subject} and ${topicC.subject}. For instance ${topicB.ideaA}. And what about the fact that ${topicC.ideaA}. Is this ethical?  In order to ensure that these technologies are used responsibly, it is important to consider their ethical implications moving forward.`,
    },
    {
      title: `The Intersection of ${topicA.subject}, ${topicB.subject}, and ${topicC.subject}`,
      text: `The intersection of ${topicA.subject}, ${topicB.subject}, and ${topicC.subject} presents a unique opportunity for innovation. One of the most promising possibilities is ${topicA.ideaA}. Additionally, the potential for ${topicB.subject} to work together with ${topicC.subject} is also encouraging. This could allow for the development of ${topicB.ideaA}. As research and development continues to explore the intersection of these disciplines, the possibilities are becoming increasingly exciting.`,
    },
    {
      title: `How ${topicB.subject} and ${topicC.subject} Are Revolutionizing ${topicA.subject}`,
      text: `The potential for ${topicB.subject} and ${topicC.subject} to revolutionize ${topicA.subject} is only beginning to be revealed. One of the most exciting possibilities is ${topicB.ideaA}. Additionally, ${topicC.subject} is also giving ${topicA.subject} a new lease on life with ${topicC.ideaB}. It is clear that ${topicB.subject} and ${topicC.subject} are creating a new era of possibility for ${topicA.subject}.`,
    },
    {
      title: `From ${topicB.subject} to ${topicC.subject}: A Journey through the History of ${topicA.subject}`,
      text: `The history of ${topicA.subject} is fascinating and filled with interesting developments. From the ${topicB.ideaA} to the evolution of ${topicC.subject}, this timeline is as diverse as it is captivating. One of the most significant events was the invention of ${topicA.ideaB}. This invention changed the way we think about ${topicC.subject} and paved the way for future developments. As technology progresses, we can only imagine what other exciting discoveries the future holds for ${topicA.subject}.`,
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
    {
      title: `The Beauty of ${topicA.subject}: An Exploration of ${topicB.subject} and ${topicC.subject}`,
      text: `${topicA.subject} is a form of art that often depicts the beauty of ${topicB.subject} and ${topicC.subject}. This beauty is seen when ${topicB.ideaA}. Additionally, when ${topicC.ideaB} it allows the viewer to appreciate the beauty of ${topicA.subject}. Therefore, it is essential for artist to explore the beauty of ${topicB.subject} and ${topicC.subject} in their work in order to create a meaningful and powerful experience for the viewer.`,
    },
    {
      title: `The Cultural Significance of ${topicA.subject}: from ${topicB.subject} to ${topicC.subject}`,
      text: `${topicA.subject} has been a source of cultural significance for many years, from ${topicB.subject} to ${topicC.subject}. This is because ${topicA.ideaA}. As a result ${topicB.ideaA}. Additionally, ${topicC.ideaA}. Therefore, it is clear that ${topicA.subject} has had a major role in the formation of certain cultural identities, and it continues to be a source of inspiration.`,
    },
    {
      title: `The Impact of ${topicA.subject} on Society: From ${topicB.subject} to ${topicC.subject}`,
      text: `${topicA.subject} has had a major impact on society, from ${topicB.subject} to ${topicC.subject}. This is because ${topicA.ideaA}. For example, in ${topicB.subject}, ${topicB.ideaB}. Similarly, in ${topicC.subject}, ${topicC.ideaB}. Therefore, it is clear that ${topicA.subject} has played a major role in how society perceives and interacts with the world around them.`,
    },
    {
      title: `The Influence of ${topicA.subject} on ${topicB.subject} and ${topicC.subject}: A Comparative Study`,
      text: `${topicA.subject} has had a great influence on ${topicB.subject} and ${topicC.subject}, a fact that is often overlooked. This is because ${topicA.ideaA}. To better understand this influence, it is important to compare the effects of ${topicA.subject} on both ${topicB.subject} and ${topicC.subject}. For example, ${topicB.ideaA}. Overall, it is clear that ${topicA.subject} has had a major impact on both ${topicB.subject} and ${topicC.subject}, and it's influence should not be ignored.`,
    },
    {
      title: `The Evolution of ${topicA.subject} in the Arts: From ${topicB.subject} to ${topicC.subject}`,
      text: `The evolution of ${topicA.subject} in the arts has been a long and complex process, from ${topicB.subject} to ${topicC.subject}. This evolution can be attributed to ${topicA.ideaA}. For example, in ${topicB.subject}, ${topicB.ideaB}. Later, in ${topicC.subject},${topicC.ideaB}. It is clear that ${topicA.subject} has evolved greatly in the arts, and as a result, has had a major impact on its evolution.`,
    },
    {
      title: `The Philosophy and Aesthetics of ${topicA.subject} in ${topicB.subject} and ${topicC.subject}`,
      text: `The philosophy and aesthetics of ${topicA.subject} in ${topicB.subject} and ${topicC.subject} has been an important part of the art world for many years. This is because ${topicA.ideaA}. For example, in ${topicB.subject}, ${topicB.ideaA}. Additionally, in ${topicC.subject}, ${topicC.ideaA}. It is clear that the philosophy and aesthetics of ${topicA.subject} has been a major factor in its evolution and popularity, and should be further studied and discussed.`,
    },
  ];

  return artsAndHumanitiesEssays[
    Math.floor(Math.random() * artsAndHumanitiesEssays.length)
  ];
};

const celebritiesAndPeople = (topicA, topicB, topicC) => {
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
    {
      title: `The Econmics of ${topicA.subject}: ${topicB.subject} vs. ${topicC.subject}`,
      text: `The economics of ${topicA.subject} has been an evolving field. As the industry continues to grow, there are two main systems of thought in regards to ${topicA.subject}: ${topicB.subject} and ${topicC.subject}. Each system has its own set of pros and cons, with ${topicB.ideaA} being the main point of contention. Ultimately, the impact of ${topicA.subject} will depend on the decision made by industry leaders, as well as the general public. It is important to weigh the pros and cons of both systems in order to make an informed decision.`,
    },
    {
      title: `The Role of ${topicA.subject} in ${topicB.subject} and ${topicC.subject}`,
      text: `${topicA.subject} has always been a part of human life and culture, but it has taken on a new significance in the modern age. In the realms of ${topicB.subject} and ${topicC.subject}, the role of ${topicA.subject} is changing rapidly. It is becoming increasingly important to understand the impact that ${topicA.subject} has on both ${topicB.subject} and ${topicC.subject}. It is also important to consider the implications of its use on society as a whole. By understanding the role of ${topicA.subject} in ${topicB.subject} and ${topicC.subject}, we can ensure that it is used in a responsible manner.`,
    },
    {
      title: `The Financial Benefits of ${topicA.subject} in ${topicB.subject} and ${topicC.subject}`,
      text: `The financial benefits of ${topicA.subject} cannot be ignored. It has the potential to revolutionize the way we conduct business in ${topicB.subject} and ${topicC.subject}. With the potential to increase efficiency and reduce waste, it is an attractive proposition. However, it is important to consider the potential risks associated with utilizing ${topicA.subject}. The financial impact of ${topicA.subject} in ${topicB.subject} and ${topicC.subject} must be carefully examined before making an informed decision. The economic benefits must be balanced with the potential risks to ensure the most beneficial outcome.`,
    },
    {
      title: `The Future of ${topicA.subject}: ${topicB.subject} or ${topicC.subject}?`,
      text: `The future of ${topicA.subject} is an exciting prospect. With the potential to revolutionize the way we use technology and conduct business, it is important to consider the implications of utilizing either ${topicB.subject} or ${topicC.subject}. Both have their own advantages and drawbacks, with ${topicB.ideaA} being one of the key considerations. Ultimately, the decision must take into account the potential benefits and risks, as well as the potential implications for society. The future of ${topicA.subject} is in our hands and will surely be an exciting development.`,
    },
    {
      title: `The Relationship Between ${topicA.subject}, ${topicB.subject} and ${topicC.subject}`,
      text: `The relationship between ${topicA.subject}, ${topicB.subject} and ${topicC.subject} has long been debated. With the rise of technology, the connection between the three is becoming increasingly important. It has been suggested that ${topicA.ideaB}. However, some experts argue that the relationship between ${topicA.subject}, ${topicB.subject} and ${topicC.subject} is more complex than that. Ultimately, it is up to industry leaders, academics, and the general public to determine the best course of action in order to maximize the potential of all three.`,
    },
    {
      title: `The Effect of ${topicA.subject} on ${topicB.subject} and ${topicC.subject}`,
      text: `The effect of ${topicA.subject} on ${topicB.subject} and ${topicC.subject} is a widely discussed topic. In recent years, ${topicA.subject} has grown in prominence, with many people considering the implications it has on both ${topicB.subject} and ${topicC.subject}. It is important to consider the impact of ${topicA.subject} in regard to both ${topicB.subject} and ${topicC.subject}, as this could have far reaching implications. It is important to consider the potential benefits and risks associated with ${topicA.subject} in order to make an informed decision.`,
    },
  ];

  return businessAndEconomicsEssays[
    Math.floor(Math.random() * businessAndEconomicsEssays.length)
  ];
};

const educationAndPedagogy = (topicA, topicB, topicC) => {
  const educationAndPedagogyEssays = [
    {
      title: `The Need for ${topicC.subject} in ${topicA.subject} and ${topicB.subject}`,
      text: `It is no secret that ${topicA.subject} and ${topicB.subject} are two of the most important aspects of our society. However, due to the unique nature of these topics, there is a need for ${topicC.subject} in order to ensure the most successful outcome. This is especially true due to ${topicC.ideaA}. Without ${topicC.subject}, the potential impacts on ${topicA.subject} and ${topicB.subject} could be dire. Thus, it is important to recognize the importance of ${topicC.subject} and the need to prioritize its implementation.`,
    },
    {
      title: `Should ${topicA.subject} be Mandatory? An Argument for ${topicB.subject} and ${topicC.subject}`,
      text: ` The debate over whether or not ${topicA.subject} should be mandatory has been ongoing for some time. Supporters of mandatory ${topicA.subject} argue that ${topicB.ideaA}, while opponents suggest that otherwise. In light of this, it is important to consider both sides of the argument in order to make an informed decision. Ultimately, the introduction of mandatory ${topicA.subject} could be beneficial if ${topicB.subject} and ${topicC.subject} are taken into consideration. It is only through the combination of both that we can ensure the most successful outcome.`,
    },
    {
      title: `The Value of ${topicA.subject} in Promoting ${topicB.subject} and ${topicC.subject}`,
      text: `${topicA.subject} has long been valued for its ability to promote both ${topicB.subject} and ${topicC.subject}. This is due to ${topicA.ideaB}. ${topicA.subject} is able to provide a valuable platform for constructive conversation and collaboration between individuals with different opinions and perspectives. Ultimately, it is through ${topicA.subject} that we can foster greater understanding of ${topicB.subject} and ${topicC.subject} and find common ground.`,
    },
    {
      title: `The Importance of ${topicA.subject} in Developing ${topicB.subject} and ${topicC.subject}`,
      text: `The importance of ${topicA.subject} in developing ${topicB.subject} and ${topicC.subject} cannot be overstated. It is ${topicA.ideaB} that has allowed for them to grow and develop over the years. While ${topicB.subject} and ${topicC.subject} are often dismissed as mere hobbies, the truth is that they are incredibly important facets of society that should not be overlooked. Without ${topicA.subject}, these fields would not be able to thrive and reach their full potential.`,
    },
    {
      title: `The Power of ${topicA.subject}: Using ${topicB.subject} and ${topicC.subject} to Enhance Learning`,
      text: `${topicA.subject} has the power to transform learning for the better. By utilizing ${topicB.subject} and ${topicC.subject}, ${topicA.subject} has the capability to enhance the learning process in ways that traditional methods cannot. ${topicA.ideaB}, for example, has been proven to increase student engagement and understanding. Additionally, ${topicA.subject} offers students a new way to connect with their material and gain further insight into the topic. Thus, it is clear that ${topicA.subject} is an invaluable tool for educators and students alike.`,
    },
    {
      title: `The Science of ${topicA.subject}: Strategies for Enhancing ${topicB.subject} and ${topicC.subject}`,
      text: `The science of ${topicA.subject} has become an increasingly popular field, as it offers insight into how to better understand and enhance ${topicB.subject} and ${topicC.subject}. Researchers have found ${topicA.ideaB} to be a promising strategy for increasing student’s understanding of the material. Other strategies include ${topicC.ideaA}, which has been shown to improve student’s performance in the classroom. Overall, the science of ${topicA.subject} provides invaluable strategies for enhancing ${topicB.subject} and ${topicC.subject}, making it an essential tool for educators.`,
    },
  ];

  return educationAndPedagogyEssays[
    Math.floor(Math.random() * educationAndPedagogyEssays.length)
  ];
};

const healthAndMedicine = (topicA, topicB, topicC) => {
  const healthAndMedicineEssays = [
    {
      title: `The Pros and Cons of ${topicA.subject}: Is it the Solution for ${topicB.subject} and  ${topicC.subject}?`,
      text: `The debate over the pros and cons of ${topicA.subject} has been ongoing between doctors for some time. On one hand, ${topicA.ideaA}. On the other hand, ${topicA.subject} has its drawbacks, such as ${topicB.ideaA}, which can be challenging to overcome. Ultimately, the decision to utilize ${topicA.subject} for ${topicB.subject} and ${topicC.subject} comes down to weighing the pros and cons in order to determine what is best for each individual situation.`,
    },
    {
      title: `The Stigma of ${topicA.subject}: Why We Need to Talk More About ${topicB.subject} and ${topicC.subject}`,
      text: `Over the years, ${topicA.subject} has gained a negative reputation among certain sections of society, leading to reluctance to discuss its potential risks and benefits. In order to properly address the issue of ${topicB.subject} and ${topicC.subject}, we must first address the underlying stigma associated with ${topicA.subject}. People who are unwilling to talk about the implications of ${topicA.subject} for ${topicB.subject} and ${topicC.subject} are doing themselves, and society, an injustice. We must open up the conversation and discuss the pros and cons of ${topicA.subject}, and only then can we arrive at a decision that benefits everyone.`,
    },
    {
      title: `The Debate on ${topicA.subject}: An Argument for ${topicB.subject} and ${topicC.subject}`,
      text: `As the debate on ${topicA.subject} continues to rage, one thing is certain: it represents a viable solution for both ${topicB.subject} and ${topicC.subject}. This is because ${topicA.ideaA}. Which allows for ${topicC.ideaB} The pros and cons of ${topicA.subject} must be carefully considered, but it is clear that it is a solution worth pursuing for ${topicB.subject} and ${topicC.subject}.`,
    },
    {
      title: `The Future of ${topicA.subject}: How ${topicB.subject} and ${topicC.subject} Are Transforming ${topicA.subject}`,
      text: `As the landscape of ${topicA.subject} continues to evolve, ${topicB.subject} and ${topicC.subject} are becoming more prevalent. This is because ${topicB.ideaA}. For these reasons, ${topicA.subject} is being transformed to meet the needs of ${topicB.subject} and ${topicC.subject}. The debate around ${topicA.subject} is ongoing, but it is clear that it has potential to revolutionize both ${topicB.subject} and ${topicC.subject}.`,
    },
    {
      title: `The Benefits of ${topicB.subject} and ${topicC.subject} for ${topicA.subject}`,
      text: `The debate around ${topicA.subject} often overlooks the potential benefits that ${topicB.subject} and ${topicC.subject} can bring. This is because ${topicB.ideaB}. This has the potential to have a major impact on ${topicA.subject} by allowing for ${topicC.ideaB}. The debate on ${topicA.subject} is complex and multifaceted, but it is clear that the potential benefits of both ${topicB.subject} and ${topicC.subject} must be considered.`,
    },
    {
      title: `The Power of ${topicA.subject}: How ${topicA.subject} Can Improve ${topicB.subject} and ${topicC.subject}`,
      text: `${topicA.subject} is emerging as a powerful tool for improving both ${topicB.subject} and ${topicC.subject}. This is because ${topicA.ideaB}. This has the potential to revolutionize ${topicB.subject} by allowing for ${topicC.ideaB}. The debate on ${topicA.subject} is ongoing, but it is clear that it has the potential to have a major impact on both ${topicB.subject} and ${topicC.subject}.`,
    },
  ];

  return healthAndMedicineEssays[
    Math.floor(Math.random() * healthAndMedicineEssays.length)
  ];
};

const environmentAndSustainability = (topicA, topicB, topicC) => {
  const environmentAndSustainabilityEssays = [
    {
      title: `Is the development of ${topicA.subject} a threat to ${topicB.subject} and ${topicC.subject}?`,
      text: `The development of ${topicA.subject} is a rapidly advancing field with the potential to change the ${topicB.subject} and ${topicC.subject}. However, as with any technological advancement, it is important to consider the potential threats and ethical implications that come with it. One concern is ${topicA.ideaB}. What is it's impact on ${topicB.subject} and ${topicC.subject}? It is crucial that we prioritize human safety and ethical considerations when developing ${topicA.subject}.`,
    },
    {
      title: `${topicA.subject} and Its Effects on ${topicB.subject} and ${topicC.subject}.`,
      text: `The debate surrounding ${topicA.subject} has recently been brought to the forefront of the public discourse. It is clear that ${topicA.subject} has the potential to revolutionize ${topicB.subject} and ${topicC.subject} because ${topicA.ideaA}. However, this potential for ${topicA.subject} to change the world is not without its concerns. There is growing concern about ${topicB.ideaB}. ${topicA.subject} is sure to have a major impact on both ${topicB.subject} and ${topicC.subject}, and so it is essential that we strike a balance between progress and preservation.`,
    },
    {
      title: `The Ethics of ${topicA.subject} in ${topicB.subject} and ${topicC.subject}`,
      text: `The ethical implications of ${topicA.subject} are largely overlooked when discussing its potential impacts on ${topicB.subject} and ${topicC.subject}. We must consider the ethical implications of ${topicA.subject}, because ${topicB.ideaA}. In addition, there are questions of privacy in the ever increasing role that ${topicA.subject} plays in our lives. The debate around ${topicA.subject} is complex, but it is clear that we must consider its ethical implications in order to ensure that ${topicB.subject} and ${topicC.subject} are not irreparably affected.`,
    },
    {
      title: `The Need for ${topicA.subject} to Combat ${topicB.subject} and ${topicC.subject}`,
      text: `In order to combat ${topicB.subject} and ${topicC.subject}, we must embrace ${topicA.subject} and its potential to help us attain a sustainable future. The use of ${topicA.subject} is key to achieving this goal because ${topicA.ideaB}. In addition, ${topicA.subject} have the potential to help us reduce our environmental impact because ${topicC.ideaB}. It is clear that the potential of ${topicA.subject} to help reduce ${topicB.subject} and ${topicC.subject} is largely untapped. We must work together to ensure that we are taking advantage of this potential and using it to create a more sustainable world.`,
    },
    {
      title: `The Illusion of ${topicA.subject}: Its Effect on ${topicB.subject} and ${topicC.subject}`,
      text: `The current debate around ${topicA.subject} and its potential impact on ${topicB.subject} and ${topicC.subject} often overlooks the fact that the potential of ${topicA.subject} is often an illusion. Many believe ${topicA.ideaA}. However, this is not the case. We must be aware of the limitations of ${topicA.subject} in order to ensure that we are using them to their fullest potential. Taking this into consideration, we can ensure that we are taking steps towards a more sustainable future.`,
    },
    {
      title: `The High Cost of ${topicA.subject}: Why We Need to Prioritize ${topicB.subject} Over ${topicC.subject}`,
      text: `The cost of implementing ${topicA.subject} is often overlooked when discussing their potential impact on ${topicB.subject} and ${topicC.subject}. We must consider the costs of utilizing ${topicA.subject}, as the high cost of implementation could lead to a reduced focus on ${topicB.subject} over ${topicC.subject}. ${topicA.ideaA} means that the cost  must be carefully managed in order to ensure that ${topicB.ideaB}. It is essential that we prioritize ${topicB.subject} over ${topicC.subject} in order to ensure that we are taking steps towards a more sustainable future.`,
    },
  ];

  return environmentAndSustainabilityEssays[
    Math.floor(Math.random() * environmentAndSustainabilityEssays.length)
  ];
};

const sportsAndRecreation = (topicA, topicB, topicC) => {
  const sportsAndRecreationEssays = [
    {
      title: `The Psychology of ${topicA.subject}: How ${topicB.subject} Stay Motivated and Focused with ${topicC.subject}`,
      text: `The key to successful ${topicA.subject} is motivation and focus. This can be achieved through ${topicB.subject} and ${topicC.subject}. It is said that ${topicB.ideaA}. However, ${topicC.ideaB}. It is important to recognize the power that ${topicB.subject} and ${topicC.subject} have to motivate and focus ${topicA.subject}. Understanding the psychology of ${topicA.subject} and how to use ${topicB.subject} and ${topicC.subject} to keep them motivated and focused can have far-reaching effects within the industry.`,
    },
    {
      title: `The Culture of ${topicA.subject}: How ${topicB.subject} Reflect ${topicC.subject} Values and Beliefs`,
      text: `The culture of ${topicA.subject} is often reflective of ${topicC.subject} beliefs and values. These values can be seen through ${topicB.subject}. It is said that ${topicB.ideaA}. This means that ${topicC.ideaB}. As such, it is important to recognize the culture of ${topicA.subject} and how ${topicB.subject} can be used to challenge or affirm ${topicC.subject} beliefs and values. Doing so can have major repercussions for society and for the future of ${topicA.subject}.`,
    },
    {
      title: `The History of the ${topicA.subject}: A Look Back at ${topicA.subject} effect on ${topicB.subject} and ${topicC.subject}`,
      text: `The history of the ${topicA.subject} dates back centuries, with its effects having been felt on ${topicB.subject} and ${topicC.subject}. It is said that ${topicA.ideaA}. This has led to ${topicB.ideaB}. On the other hand, ${topicC.ideaB}. Examining the history of the ${topicA.subject} and its effects on ${topicB.subject} and ${topicC.subject} can provide valuable insights into how to improve the environment and sustainability of ${topicA.subject}.`,
    },
  ];

  return sportsAndRecreationEssays[
    Math.floor(Math.random() * sportsAndRecreationEssays.length)
  ];
};

const religionAndSpirituality = (topicA, topicB, topicC) => {
  const religionAndSpiritualityEssays = [
    {
      title: `Why ${topicA.subject} Is More Important than ${topicB.subject} and ${topicC.subject}`,
      text: `${topicA.subject} is oftentimes considered more important than ${topicB.subject} and ${topicC.subject}. This is because ${topicA.ideaA}. As such, it is necessary to consider the importance of ${topicA.subject} in comparison to ${topicB.subject} and ${topicC.subject}.`,
    },
  ];
  return religionAndSpiritualityEssays[
    Math.floor(Math.random() * religionAndSpiritualityEssays.length)
  ];
};

const animalsAndPets = (topicA, topicB, topicC) => {
  const animalsAndPetsEssays = [
    {
      title: `The Benefits of Adopting ${topicA.subject} over ${topicB.subject} and ${topicC.subject}`,
      text: `When it comes to ${topicA.subject}, there are many advantages over ${topicB.subject} and ${topicC.subject}. One reason is ${topicA.ideaA}. Additionally, ${topicA.subject} has the ability to ${topicA.ideaB}. No one should adopt ${topicC.subject} because ${topicC.ideaB}. ${topicB.subject} is a bad choice because ${topicB.ideaB}. It is important to consider all of the pros and cons of ${topicA.subject} in relation to ${topicB.subject} and ${topicC.subject} before making a decision.`,
    },
    {
      title: `The Rising Popularity of ${topicA.subject} and Its Impact on ${topicB.subject} and ${topicC.subject}`,
      text: `The popularity of ${topicA.subject} has grown drastically in recent years. This has had an immense effect on both ${topicB.subject} and ${topicC.subject}. Because ${topicB.ideaA}, there was an increased use of ${topicA.subject}. As ${topicA.subject} become more widespread, it will have a greater impact on ${topicB.subject} and ${topicC.subject}. It is important to understand the effects of this trend so that we can ensure that it enhances rather than disempowers ${topicB.subject} and ${topicC.subject}.`,
    },
    {
      title: `The Fascinating World of ${topicA.subject}: From ${topicB.subject} to ${topicC.subject}`,
      text: `${topicA.subject} are fascinating creatures that have long captivated the attention and curiosity of humans. ${topicA.ideaA}. One curious behavior of this animal is their interaction with ${topicB.subject} and ${topicC.subject}. ${topicA.subect} are drawn to ${topicB.subject} because ${topicB.ideaB}. Also, without ${topicC.subject}, ${topicA.subject} would not be able to ${topicA.ideaB}. Overall, the world of ${topicA.subject} is a fascinating one!`,
    },
  ];
  return animalsAndPetsEssays[
    Math.floor(Math.random() * animalsAndPetsEssays.length)
  ];
};

const firstEssay = (topicA, topicB, topicC) => ({
  title: `How My New Knowledge of ${topicC.subject} will get me into Monster Academy!`,
  text: `My name is Banana and I love to roller skate. I plan on writing essays until I get into Monster Academy! Monster Academy is the most prestigious academy in all of Monster Town, so the competition to get in is pretty steep. However, with my new knowledge of ${topicC.subject}, taught to me by my new friend, I'm sure I will get in! Not a lot of people know that ${topicC.ideaA}. With my passion for roller skating and my new knowledge of ${topicC.subject}, I'm well on my way!`,
});

module.exports = {
  'History And Politics': historyAndPolitics,
  'Science And Technology': scienceAndTechnology,
  'Arts And Humanities': artsAndHumanities,
  'Celebrities And People': celebritiesAndPeople,
  'Business And Economics': businessAndEconomics,
  'Education And Pedagogy': educationAndPedagogy,
  'Health And Medicine': healthAndMedicine,
  'Environment And Sustainability': environmentAndSustainability,
  'Sports And Recreation': sportsAndRecreation,
  'Religion And Spirituality': religionAndSpirituality,
  'Animals And Pets': animalsAndPets,
  firstEssay: firstEssay,
  default: historyAndPolitics,
};
