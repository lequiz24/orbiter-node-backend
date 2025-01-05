const Activity = require('../models/Activity');
const Participant = require('../models/Participant');
const { Op } = require('sequelize');

const createActivity = async (data) => {
  const { type, subject, content, date, location, participants, userId } = data;

  // Create activity
  const activity = await Activity.create({
    type,
    subject,
    content,
    date,
    location,
    userId,
  });

  // Add participants
  if (participants && participants.length > 0) {
    const participantData = participants.map((participant) => ({
      ...participant,
      activityId: activity.id,
    }));
    await Participant.bulkCreate(participantData);
  }

  return activity;
};

// const getActivities = async (userId, lastSevenOnly) => {
//   const dateLimit = new Date(new Date() - 7 * 24 * 60 * 60 * 1000); // Date 7 days ago

//   const whereClause = {
//     userId,
//     date: { [Op.gte]: dateLimit }, // activities within the last 7 days
//   };

//   const activities = await Activity.findAll({
//     where: lastSevenOnly ? whereClause : { userId }, // If lastSevenOnly is true, apply the date filter
//     include: {
//       model: Participant, 
//       as: 'Participants', 
//       required: false, 
//     },
//     order: [['date', 'DESC']],
//   });

//   return activities;
// };

const getActivities = async (userId) => {
  const activities = await Activity.findAll({
    where: { userId },
    include: {
      model: Participant,
      as: 'Participants',
      required: false,
    },
    order: [['date', 'DESC']],
  });

  // Group activities by day
  const groupedActivities = activities.reduce((groups, activity) => {
    const day = activity.date.toISOString().split('T')[0]; // Extract the date part (YYYY-MM-DD)
    if (!groups[day]) {
      groups[day] = [];
    }
    groups[day].push({
      type: activity.type,
      subject: activity.subject,
      content: activity.content,
      location: activity.location,
      participants: activity.Participants, // Include participants in the group
    });
    return groups;
  }, {});

  // Format grouped activities into an array of orbits
  const orbits = Object.entries(groupedActivities).map(([date, activities]) => ({
    date,
    activities,
  }));

  return orbits;
};


module.exports = { createActivity, getActivities };
