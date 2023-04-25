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
                '`/teach`\nTeaching your monster is what this game is all about! Type `/teach` and then type about whatever you want to teach your monster! Your monster will start studying the text you input and once it is done it will create a **note**!\n\n',
              inline: false,
            },
            {
              name: 'Essay',
              value:
                '`/essay`\nTime to write an essay! Your monster needs three **notes** to create an **essay**. Once you select three notes your monster will start writing the essay. But be careful your monster may get confused while writing!',
              inline: false,
            },
            {
              name: 'Lookup',
              value:
                'Look up helps you view important details about your monster.\n\n `/lookup stats`\nDisplays your level and experience.\n\n `/lookup notes`\nDisplays all of the **notes** your monster has created.\n\n `/lookup essays`\nDisplays all of the **essays** your monster has written.',
              inline: false,
            },
            {
              name: 'Reset',
              value:
                '`/reset`\n\nThis resets your monster to level 1! Everything you taught your monster and every essay you monster wrote will be reset.\n\n',
              inline: false,
            },
            {
              name: 'Subscriptions',
              value:
                "In order to advance your monster's level and continue sending messages you must subscribe to Study Monsters Academy. This will allow you to send more messages to your monster.\n\nIf you want to unsubscribe you can do so at any time. Either send a direct messag to the LaunchPass bot on #StudyMonstersAcademy and input `cancel` or click the Cancel subscription link in invoice email sent to you.",
              inline: false,
            },
          ],
        },
      ],
    });
  },
};
