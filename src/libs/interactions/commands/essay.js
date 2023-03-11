const {
  ActionRowBuilder,
  ButtonBuilder,
  InteractionCollector,
} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('essay')
    .setDescription('Create an essay from three notes')
    .addStringOption((option) =>
      option
        .setName('essay_input')
        .setDescription('Input the titles like this: /essay note1 note2 note3')
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      if (interaction.type === 2) {
        const notes = interaction.options.getString('essay_input').split(' ');

        if (notes.length > 3) {
          await interaction.reply({
            content: 'You entered to many notes!',
          });
          return;
        }
        if (notes.length < 3) {
          await interaction.reply({
            content:
              'You did not enter enough notes for me to create an essay!',
          });
          return;
        }

        // CHECK IS NOTES EXIST
      }
      const questionUp = new ButtonBuilder()
        .setCustomId(`questionUp_essay_${interaction.user.id}${interaction.id}`)
        .setLabel('Yes')
        .setEmoji('👍')
        .setStyle('Primary');

      const questionDown = new ButtonBuilder()
        .setCustomId(
          `questionDown_essay_${interaction.user.id}${interaction.id}`
        )
        .setLabel('No')
        .setEmoji('👎')
        .setStyle('Primary');

      const row = new ActionRowBuilder().addComponents(
        questionUp,
        questionDown
      );

      const filter = (m) =>
        (m.customId ===
          `questionUp_essay_${interaction.user.id}${interaction.id}` ||
          m.customId ===
            `questionDown_essay_${interaction.user.id}${interaction.id}`) &&
        m.user.id === interaction.user.id;

      const collector = new InteractionCollector(interaction.client, {
        filter,
        max: 3,
        time: 1000 * 60,
      });

      if (interaction.type === 2) {
        await interaction.reply({
          content: 'test0',
          components: [row],
        });
      }
      collector.on('collect', async (m) => {
        if (m?.author?.bot !== true && !collector.checkEnd()) {
          await m.reply({
            content: 'test' + collector.total,
            components: [row],
          });
          return;
        } else {
          await m.reply('HERE IS THE ESSAY');
        }
      });

      collector.on('end', async (collected, reason) => {
        console.log('collected132', collected, reason);
      });
    } catch (e) {
      console.log(e);
    }
  },
};
