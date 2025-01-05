const Activity = require('./Activity');
const Participant = require('./Participant');

// associations
Activity.hasMany(Participant, { foreignKey: 'activityId' });
Participant.belongsTo(Activity, { foreignKey: 'activityId' });

module.exports = { Activity, Participant };
