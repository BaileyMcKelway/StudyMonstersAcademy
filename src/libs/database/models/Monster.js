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
      defaultValue: 199,
      allowNull: false,
      validate: {
        max: { args: [1100], msg: 'The maximum value for experience is 1100' },
      },
    },
    type: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 1,
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
    indexes: [
      {
        unique: false,
        fields: ['user_id_and_type'],
      },
    ],
  }
);

module.exports = Monster;
