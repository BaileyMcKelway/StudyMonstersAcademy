const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lookup')
    .setDescription('Lookup stats, essays, and notes for your monster')
    .addStringOption((option) =>
      option
        .setName('lookup')
        .setDescription('What do you want to lookup?')
        .setRequired(true)
        .addChoices([
          ['Stats', 'stats'],
          ['Essays', 'essays'],
          ['Notes', 'notes'],
        ])
    ),
  async execute(interaction) {
    const commandType = interaction.options.getString('lookup');

    if (commandType === 'stats') {
      await interaction.reply({
        content: '',
        embeds: [
          {
            title: `Stats`,
            description: '',
            color: 14588438,
            fields: [
              {
                name: `Level ⬆️`,
                value: `0`,
              },
              {
                name: `Experience 📈`,
                value: `0/100`,
              },
              {
                name: `Skill Points`,
                value: `Memory 🧠 :_ _ _ _ _\nComprehension 🤔:_ _ _ _ _\n`,
              },
            ],
          },
        ],
      });
    } else if (commandType === 'essays') {
      await interaction.reply({
        content: '',
        embeds: [
          {
            title: 'Essays',
            color: 14588438,
            fields: [
              {
                name: `Essay Title 1 by Banana`,
                value: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum`,
              },
            ],
          },
        ],
      });
    } else if (commandType === 'notes') {
      await interaction.reply({
        content: '',
        embeds: [
          {
            title: 'Notes',
            color: 14588438,
            fields: [
              {
                name: `Space 3/3`,
                value: '',
              },
              {
                name: `Note 1`,
                value: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum`,
              },
              {
                name: `Note 2`,
                value: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum`,
              },
              {
                name: `Note 3`,
                value: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum`,
              },
            ],
          },
        ],
      });
    }
  },
};
