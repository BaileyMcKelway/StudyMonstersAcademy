import { Sequelize } from 'sequelize';
import {
  postgresUser,
  postgresDb,
  postgresPassword,
  dbHost,
  dbURL,
} from '../config';

const sequelize = new Sequelize(dbURL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export default sequelize;
