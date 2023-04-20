const db = require('../index');
const Sequelize = require('sequelize');
const { Model, DataTypes } = require('sequelize');

class Essays extends Model {
  static associate() {}
}

Essays.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    paranoid: true,
    sequelize: db,
    modelName: 'Essays',
    indexes: [
      {
        unique: false,
        fields: ['user_id_and_type'],
      },
    ],
  }
);

module.exports = Essays;
