const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); 

const Activity = sequelize.define('Activity', {
  type: {
    type: DataTypes.ENUM('event', 'email'),
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  location: {
    type: DataTypes.JSON,
    allowNull: true, 
  },
  userId: {
    type: DataTypes.UUID,
    //defaultValue: DataTypes.UUIDV4, 
    allowNull: false,
    //unique: true, 
  },
}, 
// { timestamps: true });
{
  timestamps: true,
indexes: [
  { fields: ['type'] }, 
  { fields: ['date'] }, 
  { fields: ['userId'] }, 
],
});

module.exports = Activity;
