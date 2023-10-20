import { readdirSync } from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import path from 'path';
import logger from '../../logger';
import {
  discordClientId,
  discordToken,
  shouldCreateCommands,
} from '../../config';

export default async () => {
  const commands: any[] = [];
  const commandFiles = readdirSync(
    path.resolve(process.cwd(), './src/libs/interactions/commands')
  );

  for (const file of commandFiles) {
    logger.info(`Loading interaction ./src/libs/interactions/commands/${file}`);
    const command: any = await import(`../commands/${file}`);
    commands.push(command.default);
  }

  logger.info(`Finished loading interactions`);

  if (shouldCreateCommands) {
    logger.info('Registering interactions with Discord');
    if (discordToken && discordClientId) {
      const rest = new REST({ version: '9' }).setToken(discordToken);
      await rest.put(Routes.applicationCommands(discordClientId), {
        body: commands.map((x) => x.data),
      });
      logger.info('Succesfully created slash interactions with Discord');
    }
  }

  return commands;
};
