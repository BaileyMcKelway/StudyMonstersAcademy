const db = require('../index');
const { User } = './index';
const Sequelize = require('sequelize');

class Monster extends Sequelize.Model {
  static associate() {}
}

Monster.init(
  {
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    experience: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    memory: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0,
        max: 5,
      },
    },
    comprehension: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0,
        max: 5,
      },
    },
    type: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 10,
      },
    },
    knowledge: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
  },
  {
    paranoid: true,
    sequelize: db,
    modelName: 'Monster',
  }
);

module.exports = Monster;
