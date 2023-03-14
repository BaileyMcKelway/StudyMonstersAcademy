const db = require('../index');
const Sequelize = require('sequelize');
const { Model, DataTypes } = require('sequelize');

class Notes extends Model {
  static associate() {}
}

Notes.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    quality: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ideas: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    paranoid: true,
    sequelize: db,
    modelName: 'Notes',
  }
);

module.exports = Notes;
