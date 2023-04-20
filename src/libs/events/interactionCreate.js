const logger = require('../logger');
const { serverId } = require('../config');
const { AttachmentBuilder } = require('discord.js');
const { getMonster } = require('../database/utils');

module.exports = async (interaction, client) => {
  try {
    let monster = await getMonster({ user: interaction.user });
    if (monster.level >= 2) {
      const guild = await client.guilds.cache.get(serverId);
      const member = await guild.members.fetch(interaction.user.id);
      const roles = await member.roles.cache.map((role) => role.name);
      if (!roles.includes('Premium')) {
        const file = new AttachmentBuilder(
          '/Users/baileymckelway/Documents/VS-STUDIO/StudyMonsterz/src/assets/study_monster_academy.png'
        );

        await interaction.reply({
          content: '  ',
          embeds: [
            {
              title: 'Subscribe to Study Monsters Academy to continue! 💳',
              description:
                'You have reached the maximum amount of messages you can send to your study monster. Please subscribe to continue.',
              color: 14588438,
              image: {
                url: 'attachment://study_monster_academy.png',
              },
            },
          ],
          files: [file],
        });
        return;
      }
    }
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
    await command.execute(interaction);
  } catch (err) {
    logger.error(err, 'An error occured executing a command');
  }
};
