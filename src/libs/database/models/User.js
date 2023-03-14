const db = require('../index');
const { Model, DataTypes } = require('sequelize');

class User extends Model {
  static associate() {}
}

User.init(
  {
    user_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      primaryKey: true,
    },
    discord_channel_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    subscription: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    paywall: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    paranoid: true,
    sequelize: db,
    modelName: 'User',
  }
);

module.exports = User;
