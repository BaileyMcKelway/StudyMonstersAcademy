import db from '../index';
import Sequelize, { Model, DataTypes } from 'sequelize';

export default class Notes extends Model {
  category: any;
  subject: any;
  id: any;
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
    category: {
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
    indexes: [
      {
        unique: false,
        fields: ['user_id_and_type'],
      },
    ],
  }
);

module.exports = Notes;
