const express = require('express');
const { createActivity, getActivities, aiSearchActivities } = require('../controllers/activityController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/activities', authenticate, createActivity);
router.get('/activities', authenticate, getActivities);

router.post('/activities/search',authenticate, aiSearchActivities);

module.exports = router;
