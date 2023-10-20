import { Client, GatewayIntentBits, Collection, Partials } from 'discord.js';
import logger from './libs/logger';
import { discordToken, forceDbReset } from './libs/config';
import { ready, interactionCreate, messageCreate } from './libs/events';
import initializeInteractions from './libs/interactions/init/initializeInteractions';
import db from './libs/database';
import models from './libs/database/models';

const client: any = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
  ],
  partials: [Partials.Channel],
});

client.commands = new Collection();
(async () => {
  logger.info(`Bot beginning startup`);

  const commands = await initializeInteractions();
  commands.forEach((command) => {
    client.commands.set(command.data.name, command);
  });

  logger.info(`Connecting to dabatase`);

  Object.keys(models).forEach((ele) => {
    models[ele].associate(models);
  });
  await db.sync({ force: forceDbReset });

  logger.info(`Completed database connection`);

  client.on('ready', ready);
  client.on('interactionCreate', (interaction) =>
    interactionCreate(interaction)
  );
  client.on('messageCreate', (message) => messageCreate(message));

  logger.info('Authenticating with Discord');

  await client.login(discordToken);

  logger.info('Completed Discord authentication');
})();
