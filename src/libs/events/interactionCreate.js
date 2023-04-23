const logger = require('../logger');
const { serverId } = require('../config');
const { AttachmentBuilder } = require('discord.js');
const { getMonster, createUser } = require('../database/utils');
const { TYPE } = require('../global');

module.exports = async (interaction, client) => {
  try {
    const monster = await getMonster({ user: interaction.user });
    if (
      interaction.isButton() &&
      interaction.customId === `Start ${TYPE}` &&
      !monster
    ) {
      await interaction.user.send(
        'Hi! 👋 Thank you for choosing me! This is very exciting!\n\nMy name is Banana, and all I want to do is learn, and you are going to teach me! If I learn a lot, maybe I’ll get into Monster Academy!📚\n\nCurrently, I don’t know much about anything except for roller skating 🛼, which is my favorite thing to do. So, if you try to talk to me about a subject, I won’t have much to say. Can you teach me something new?\n\nYou can teach me something using the `/teach` command.\n Type `/teach`, and then enter everything you want me to know about one subject. I’ll study that information and then create a note about that subject!📝 I may have a few questions, though...\n\nI already have two notes created! One is all about me, and the other is about Monster Academy! \n-Type `/lookup notes` to view my notes\n\nOnce I have three notes, I can then write an essay!\n-Type `/essay` and enter the titles of the three notes\n-The main subject goes first, followed by the two supporting subjects.\n-Like this: `Main Subject, Supporting Subject A, Supporting Subject B`\n\nOnce I write an essay, I’ll learn those three things! Then we can talk about them! 😄'
      );
      await createUser({ user: interaction.user });
      return;
    }
    if (
      interaction.isButton() &&
      interaction.customId === `Start ${TYPE}` &&
      monster
    ) {
      await interaction.user.send('Hi!');
      return;
    }

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
    if (
      interaction?.commandName === 'essay' ||
      interaction?.message?.interaction?.commandName === 'essay' ||
      interaction?.commandName === 'lookup' ||
      interaction?.message?.interaction?.commandName === 'lookup'
    ) {
      await command.execute(interaction, monster);
    } else {
      await command.execute(interaction);
    }
  } catch (err) {
    logger.error(err, 'An error occured executing a command');
  }
};
