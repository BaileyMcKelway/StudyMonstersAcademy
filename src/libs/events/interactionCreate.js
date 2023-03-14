const logger = require('../logger');

module.exports = async (interaction) => {
  try {
    if (
      interaction.isButton() &&
      interaction?.message?.interaction?.commandName !== 'teach' &&
      interaction?.message?.interaction?.commandName !== 'essay'
    ) {
      return;
    }
    console.log('interaction', interaction);
    if (interaction.commandName === 'react') {
      console.log('interaction123', interaction);
    }

    let command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      command = interaction.client.commands.get(
        interaction.message.interaction.commandName
      );
    }
    await command.execute(interaction);
  } catch (err) {
    logger.error(err, 'An error occured executing a command');
  }
};
