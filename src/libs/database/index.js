const { Sequelize } = require('sequelize');
const {
  postgresUser,
  postgresDb,
  postgresPassword,
  dbHost,
} = require('../config');

console.log(postgresUser, postgresDb, postgresPassword, dbHost);
const sequelize = new Sequelize(postgresDb, postgresUser, postgresPassword, {
  host: dbHost,
  dialect: 'postgres',
});

module.exports = sequelize;
