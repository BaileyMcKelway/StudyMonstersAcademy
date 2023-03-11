const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays help menu'),
  async execute(interaction) {
    await interaction.reply({
      content: '',
      embeds: [
        {
          title: 'Help Menu',
          description: 'This is the help menu for Study Monsters!',
          color: 14588438,
          fields: [
            {
              name: 'Teach',
              value:
                '*/teach*\nTeaching your monster is what this game is all about! Type */teach* and then copy and paste text from anywhere into the text field! Your monster will start studying the text you input and once it is done it will create a **note**!\n\n',
              inline: false,
            },
            {
              name: 'Essay',
              value:
                '*/essay*\nTime to write an essay! Your monster needs three **notes** to create an **essay**. Once you select three notes your monster will start writing the essay. But be careful your monster may get confused while writing!',
              inline: false,
            },
            {
              name: 'Lookup',
              value:
                'Look up helps you view important details about your monster.\n\n */lookup stats*\nDisplays your level, experience, and skill points.\n\n */lookup notes*\nDisplays all of the **notes** your monster has created.\n\n */lookup essays*\nDisplays all of the **essays** your monster has written.',
              inline: false,
            },
            {
              name: 'Help',
              value: '*/help*\n\nErr... You are already here.\n\n',
              inline: false,
            },
          ],
        },
      ],
    });
  },
};
