const express = require('express');
const router = express.Router();
const { googleLogin ,registerUser, loginUser, getProfile, updateProfile, updateProfilePicture } = require('../controllers/userController');
const { googleAuth, googleAuthCallback } = require('../controllers/googleAuthController');

const { authenticate } = require('../middlewares/authMiddleware');
const multer = require('multer');

router.post('/register', registerUser);  
router.post('/login', loginUser);


router.get('/profile', authenticate, getProfile);
router.post('/updateProfile', authenticate, updateProfile);
router.put('/profile-image', authenticate, multer().single('profileImage'), updateProfilePicture);

//router.get('/auth/googleLogin', googleAuth);
router.get('/auth/google/callback', googleAuthCallback);

router.post('/googleLogin', googleLogin);

module.exports = router;
