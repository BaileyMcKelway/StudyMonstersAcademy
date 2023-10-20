import logger from '../logger';
import { getMonster, createUser } from '../database/utils';
import { gameIntro } from '../interactions/teachConstants';
import { TYPE, BLOCKED_CHANNELS, START_GAME_CHANNEL_ID } from '../global';

interface interactionProps {
  channel: {
    id: string;
  };
  user: { send: (arg0: string) => void };
  isButton: () => boolean;
  customId: string;
  message?: {
    interaction?: {
      commandName: string;
    };
  };
  commandName?: string;
  client: any;
}

export default async (interaction: interactionProps) => {
  try {
    if (BLOCKED_CHANNELS.includes(interaction.channel.id)) return;
    const monster = await getMonster({ user: interaction.user });

    const isStartOfGame =
      interaction.isButton() &&
      interaction.customId === `Start ${TYPE}` &&
      !monster &&
      interaction.channel.id === START_GAME_CHANNEL_ID;

    const hasAlreadyStartedGame =
      interaction.isButton() &&
      interaction.customId === `Start ${TYPE}` &&
      monster &&
      interaction.channel.id === START_GAME_CHANNEL_ID;

    const shouldIgnore =
      !monster ||
      (interaction.isButton() &&
        interaction?.message?.interaction?.commandName !== 'teach' &&
        interaction?.message?.interaction?.commandName !== 'essay');

    if (isStartOfGame) {
      await interaction.user.send(gameIntro);
      await createUser({ user: interaction.user });
      return;
    } else if (hasAlreadyStartedGame) {
      await interaction.user.send('Hi!');
      return;
    } else if (shouldIgnore) {
      return;
    }

    let command = interaction?.client?.commands.get(interaction.commandName);

    if (!command) {
      command = interaction?.client?.commands.get(
        interaction?.message?.interaction?.commandName
      );
    }
    const commandNeedsMonsterData =
      interaction?.commandName === 'teach' ||
      interaction?.message?.interaction?.commandName === 'teach' ||
      interaction?.commandName === 'essay' ||
      interaction?.message?.interaction?.commandName === 'essay' ||
      interaction?.commandName === 'lookup' ||
      interaction?.message?.interaction?.commandName === 'lookup';

    if (commandNeedsMonsterData) {
      await command.execute(interaction, monster);
    } else {
      await command.execute(interaction);
    }
  } catch (err) {
    logger.error(err, 'An error occured executing a command');
  }
};
