
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Preferences extends Model {}

Preferences.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  showEmptySpaces: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, 
  },
}, {
  sequelize,
  modelName: 'Preferences',
  timestamps: true,
});

module.exports = Preferences;
