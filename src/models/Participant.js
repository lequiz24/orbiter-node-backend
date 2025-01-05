const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); 

const Participant = sequelize.define('Participant', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.JSON,
    allowNull: true, 
  },
  imageUrl: { 
    type: DataTypes.STRING,
    allowNull: true,
  },
  participantId: {
    type: DataTypes.UUID,
    //defaultValue: DataTypes.UUIDV4, 
    allowNull: false,
    //unique: true, 
  },
  activityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
},
//  { timestamps: true });
 { 
  timestamps: true,
  indexes: [
    { fields: ['email'] }, 
    { fields: ['participantId'], unique: true }, 
    { fields: ['activityId'] }, 
  ],
});

module.exports = Participant;
