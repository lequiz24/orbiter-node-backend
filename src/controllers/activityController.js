const activityService = require('../services/activityService');
const participantService = require('../services/participantService');
const openaiService = require('../services/openaiService');
const { fetchLogoUrl } = require('../services/logoService');
const jwt = require('jsonwebtoken');

const createActivity = async (req, res) => {
  try {
    // get token 
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
     
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

  
      if (!userId) {
        return res.status(400).json({ message: 'User ID is missing in the token' });
      }

      const { type, subject, date, location, domain } = req.body;

     
      const participants = await participantService.fetchRandomParticipants(5);

      // Generate content from open ai
      const content = await openaiService.generateContent(type, subject);

    
      const logoUrl = domain ? fetchLogoUrl(domain) : null;

      // Create activity
      const activity = await activityService.createActivity({
        type,
        subject,
        content,
        date,
        location,
        participants,
        userId, 
        logoUrl,
      });

      res.status(200).json(activity);
    } catch (err) {
     
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating activity' });
  }
};


const getActivities = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
  
    
    const token = authHeader?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
     
      //console.log("user token",decoded );
      const userId = decoded.userId;
      if (!userId) {
        return res.status(400).json({ message: 'User ID is missing in the token' });
      }

      const orbits = await activityService.getActivities(userId);
      
      console.log("Activities fetched for user:", orbits);

      res.status(200).json(orbits);
    } catch (err) {
     
      return res.status(401).json({ message: 'Invalid token', error: err.message });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ message: 'Error fetching activities' });
  }
};



// AI-Powered Search Endpoint
const aiSearchActivities = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing in the token' });
    }

    
    const activities = await activityService.getActivities(userId);


    const activityDescriptions = activities.map(activity => 
      `${activity.type}: ${activity.subject} on ${activity.date} at ${activity.location}`
    );

   
    const aiSummary = await openaiService.generateSearchSummary(query, activityDescriptions);

    res.status(200).json({ summary: aiSummary });
  } catch (error) {
    console.error('Error in AI-powered search:', error);
    res.status(500).json({ message: 'Error processing AI search' });
  }
};


module.exports = { createActivity, getActivities, aiSearchActivities };
