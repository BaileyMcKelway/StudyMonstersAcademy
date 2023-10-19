import dotenv from 'dotenv';

dotenv.config({
  path: `${process.cwd()}/.env.prod`,
});

export const discordToken = process.env.DISCORD_TOKEN;
export const discordClientId = process.env.CLIENT_ID;
export const shouldCreateCommands =
  process.env.SHOULD_CREATE_COMMANDS === 'true';
export const dbHost = process.env.DB_HOST;
export const postgresUser = process.env.POSTGRES_USER || '';
export const postgresDb = process.env.POSTGRES_DB || '';
export const postgresPassword = process.env.POSTGRES_PASSWORD;
export const forceDbReset = process.env.FORCE_DB_RESET === 'true';
export const openAIKey = process.env.OPENAI_KEY;
export const openAIOrganization = process.env.OPENAI_ORGANIZATION;
export const serverId = process.env.SERVER_ID;
export const isDev = process.env.IS_DEV === 'true';
