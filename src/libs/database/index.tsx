import { Sequelize } from 'sequelize';
import { postgresUser, postgresDb, postgresPassword, dbHost } from '../config';

const sequelize = new Sequelize(postgresDb, postgresUser, postgresPassword, {
  host: dbHost,
  dialect: 'postgres',
});

export default sequelize;
