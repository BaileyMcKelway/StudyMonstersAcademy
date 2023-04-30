const dotenv = require('dotenv');

dotenv.config({
  path: `${process.cwd()}/.env.prod`,
});

module.exports = {
  discordToken: process.env.DISCORD_TOKEN,
  discordClientId: process.env.CLIENT_ID,
  shouldCreateCommands: process.env.SHOULD_CREATE_COMMANDS === 'true',
  dbHost: process.env.DB_HOST,
  postgresUser: process.env.POSTGRES_USER,
  postgresDb: process.env.POSTGRES_DB,
  postgresPassword: process.env.POSTGRES_PASSWORD,
  forceDbReset: process.env.FORCE_DB_RESET === 'true',
  openAIKey: process.env.OPENAI_KEY,
  openAIOrganization: process.env.OPENAI_ORGANIZATION,
  serverId: process.env.SERVER_ID,
  isDev: process.env.IS_DEV === 'true',
};
