const { SlashCommandBuilder } = require('@discordjs/builders');
const { getMonster, getNotes, getEssays } = require('../../database/utils');

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
      const monster = await getMonster(interaction.user);
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
                value: monster.level,
              },
              {
                name: `Experience 📈`,
                value: `${monster.experience} / ${monster.level * 200 + 100}`,
              },
              {
                name: `Skill Points`,
                value: `Memory 🧠 :${monster.memory}\nComprehension 🤔:${monster.comprehension}\n`,
              },
            ],
          },
        ],
      });
    } else if (commandType === 'essays') {
      const essays = await getEssays(interaction.user);

      let fields = [];
      essays.forEach((essay) => {
        fields.push({
          name: 'Essay',
          value: essay?.dataValues?.text,
        });
      });
      if (fields.length === 0) {
        fields = [{ name: 'No essays', value: '' }];
      }
      await interaction.reply({
        content: '',
        embeds: [
          {
            title: 'Essays',
            color: 14588438,
            fields: fields,
          },
        ],
      });
    } else if (commandType === 'notes') {
      const monster = await getMonster(interaction.user);
      const notes = await getNotes(interaction.user);
      const fields = [
        {
          name: `Space ${notes.length || 0}/${monster.memory + 3}`,
          value: '',
        },
      ];

      notes.forEach((note) => {
        let value = note?.dataValues?.text;
        if (value.length > 500) {
          value = note?.dataValues?.text.slice(0, 500) + '...';
        }

        fields.push({
          name: note?.dataValues?.subject,
          value,
        });
      });
      await interaction.reply({
        content: '',
        embeds: [
          {
            title: 'Notes',
            color: 14588438,
            fields: fields,
          },
        ],
      });
    }
  },
};
