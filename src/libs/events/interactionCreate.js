const logger = require('../logger');

module.exports = async (interaction, user) => {
  try {
    if (
      interaction.isButton() &&
      interaction?.message?.interaction?.commandName !== 'teach' &&
      interaction?.message?.interaction?.commandName !== 'essay'
    ) {
      return;
    }

    let command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      command = interaction.client.commands.get(
        interaction.message.interaction.commandName
      );
    }
    await command.execute(interaction, user);
  } catch (err) {
    logger.error(err, 'An error occured executing a command');
  }
};
