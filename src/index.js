const {
  Client,
  GatewayIntentBits,
  Collection,
  Partials,
  ActionRowBuilder,
  ButtonBuilder,
} = require('discord.js');

const logger = require('./libs/logger');
const { discordToken, forceDbReset } = require('./libs/config');
const { ready, interactionCreate, messageCreate } = require('./libs/events');
const initializeInteractions = require('./libs/interactions/init/initializeInteractions');
const db = require('./libs/database');
const models = require('./libs/database/models');
const client = new Client({
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
    interactionCreate(interaction, client)
  );
  client.on('messageCreate', (message) => {
    // const chooseButton = new ButtonBuilder()
    //   .setCustomId(`Start ${TYPE}`)
    //   .setLabel('Choose Me!')
    //   .setEmoji('👉')
    //   .setStyle('Primary');

    // const row = new ActionRowBuilder().addComponents(chooseButton);
    // message.reply({ components: [row] });
    messageCreate(message, client);
  });
  logger.info('Authenticating with Discord');
  await client.login(discordToken);
  logger.info('Completed Discord authentication');
})();
