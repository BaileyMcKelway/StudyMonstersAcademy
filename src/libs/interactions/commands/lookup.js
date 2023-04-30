const { SlashCommandBuilder } = require('@discordjs/builders');
const { getNotes, getEssays } = require('../../database/utils');

const createWhatMonsterKnowsString = (knowledge) => {
  return knowledge
    .split(',')
    .filter((item) => item !== '')
    .map((subject) => subject.replace(/\b\w/g, (char) => char.toUpperCase()))
    .join(', ');
};

const createWhatMonsterKnowsArray = (knowledge) => {
  return knowledge.split(',').filter((item) => item !== '');
};

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
          ['Knowledge', 'knowledge'],
        ])
    ),
  async execute(interaction, monster) {
    try {
      const commandType = interaction.options.getString('lookup');

      if (commandType === 'stats') {
        await interaction.deferReply({ ephemeral: true });
        await interaction.editReply({
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
                  value: `${monster.experience} / ${monster.level * 100 + 100}`,
                },
              ],
            },
          ],
        });
      } else if (commandType === 'essays') {
        await interaction.deferReply({ ephemeral: true });
        const essays = await getEssays(interaction.user);
        if (!essays) {
          await interaction.editReply({
            content: '',
            embeds: [
              {
                title: 'Essays',
                color: 14588438,
                fields: [{ name: 'No essays', value: '' }],
              },
            ],
          });
        }
        if (essays.length === 0) {
          await interaction.editReply({
            content: '',
            embeds: [
              {
                title: 'Essays',
                color: 14588438,
                fields: [{ name: 'No essays', value: '' }],
              },
            ],
          });
        }
        let res = '';
        for (let i = 0; i < essays.length; i++) {
          res += `- ${essays[i].title}\n`;

          if (i % 10 === 0) {
            if (i === 10) {
              await interaction.editReply({
                content: '',
                embeds: [
                  {
                    title: 'Essays',
                    color: 14588438,
                    fields: [{ name: 'Essay Titles', value: res }],
                  },
                ],
              });
              res = '';
            } else if (i > 10) {
              await interaction.followUp({
                content: '',
                embeds: [
                  {
                    title: 'Essays',
                    color: 14588438,
                    fields: [{ name: 'Essay Titles', value: res }],
                  },
                ],
              });
              res = '';
            }
          }
        }
        if (essays.length < 10) {
          await interaction.editReply({
            content: '',
            embeds: [
              {
                title: 'Essays',
                color: 14588438,
                fields: [{ name: 'Essay Titles', value: res }],
              },
            ],
          });
        }
      } else if (commandType === 'notes') {
        await interaction.deferReply({ ephemeral: true });
        const notes = await getNotes(interaction.user);
        if (!notes) {
          await interaction.editReply({
            content: '',
            embeds: [
              {
                title: 'Notes',
                color: 14588438,
                fields: [{ name: `Space 0/${3}`, value: '' }],
              },
            ],
          });
        }
        const fields = [
          {
            name: `Space ${notes.length || 0}/${3}`,
            value: '',
          },
        ];

        notes.forEach((note) => {
          let value =
            '*Category: ' + note.category + '*\n\n' + note?.dataValues?.text;
          if (value.length > 500) {
            value = value.slice(0, 500) + '...';
          }

          fields.push({
            name: '*Title: ' + note?.dataValues?.subject + '*',
            value,
          });
        });
        await interaction.editReply({
          content: '',
          embeds: [
            {
              title: 'Notes',
              color: 14588438,
              fields: fields,
            },
          ],
        });
      } else if (commandType === 'knowledge') {
        await interaction.deferReply({ ephemeral: true });
        const { knowledge } = monster;
        const knowledgeString = createWhatMonsterKnowsString(knowledge);
        await interaction.editReply({
          content: '',
          embeds: [
            {
              title: 'Knowledge',
              color: 14588438,
              fields: [
                {
                  name: `${createWhatMonsterKnowsArray(knowledge).length}/150`,
                  value: '',
                },
                {
                  name: 'Here are the things I know about:',
                  value: knowledgeString === '' ? '...' : knowledgeString,
                },
              ],
            },
          ],
        });
      }
    } catch (e) {
      console.log(e);
    }
  },
};
