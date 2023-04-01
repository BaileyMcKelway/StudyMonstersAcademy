const db = require('../index');
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
        max: { args: [1100], msg: 'The maximum value for experience is 1100' },
      },
    },
    memory: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        max: { args: [5], msg: 'The maximum value for memory is 5' },
      },
    },
    comprehension: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        max: { args: [5], msg: 'The maximum value for comprehension is 5' },
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
        max: { args: [10], msg: 'The maximum value for level is 10' },
      },
    },
    knowledge: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    metadata: {
      type: Sequelize.DataTypes.JSON,
      allowNull: false,
      defaultValue: JSON.stringify({}),
    },
  },
  {
    paranoid: true,
    sequelize: db,
    modelName: 'Monster',
  }
);

module.exports = Monster;
