const { SlashCommandBuilder } = require('@discordjs/builders');
const { resetMonster } = require('../../database/utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reset')
    .setDescription(
      'Reset your monster. ONLY DO THIS IF YOU WANT TO LOSE ALL YOUR PROGRESS!'
    )
    .addStringOption((option) =>
      option
        .setName('reset')
        .setDescription('Type: "RESET MY MONSTER" to reset your monster.')
        .setRequired(true)
    ),
  async execute(interaction) {
    if (interaction.options.getString('reset') === 'RESET MY MONSTER') {
      await interaction.reply('Resetting your monster...');
      await resetMonster({ user: interaction.user });
    } else {
      await interaction.reply('You did not type: "RESET MY MONSTER"');
    }
  },
};
