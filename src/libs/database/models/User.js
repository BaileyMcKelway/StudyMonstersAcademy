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
    user_id_and_type: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    paranoid: true,
    sequelize: db,
    modelName: 'User',
  }
);

module.exports = User;
