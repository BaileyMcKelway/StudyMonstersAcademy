const logger = require('../logger');
const { updateMonster } = require('../database/utils');
const isBot = (event) => event.message.author.bot === true;
const isMemoryReaction = (reaction) =>
  reaction._emoji.name === '🧠' && reaction.count === 2;
const isComprehensionReaction = (reaction) =>
  reaction._emoji.name === '🤔' && reaction.count === 2;
module.exports = async (reaction) => {
  try {
    console.log('reaction.message123', reaction.message);
    console.log('reaction123', reaction);
    if (isMemoryReaction(reaction)) {
      await updateMonster({ skill: 'memory', user: reaction.message.author });
    }
    if (isComprehensionReaction(reaction)) {
      await updateMonster({
        skill: 'comprehension',
        user: reaction.message.author,
      });
    }
  } catch (err) {
    logger.error(err, 'An error occured executing a command');
  }
};
