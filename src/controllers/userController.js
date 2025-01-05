const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user'); 
const multer = require('multer');
const path = require('path');
const { sendConfirmationEmail } = require('../config/email');
const axios = require('axios');



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage: storage });



const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

 
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

  
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send confirmation email
    const emailSubject = 'Welcome to Our Platform!';
    const emailContent = `Hi ${newUser.name},\n\nThank you for registering. Your registration is complete.`;
    await sendConfirmationEmail(newUser.email, emailSubject, emailContent);

    
    res.status(200).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};


// Get user profile
const getProfile = async (req, res) => {
   
    const token = req.headers['authorization']?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;
  
      
      const user = await User.findOne({ where: { id: userId } });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        preferences: user.preferences,
      });
    } catch (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({ message: 'Invalid token' });
    }
  };


  const updateProfile = async (req, res) => {
    const { name, bio, profilePicture, preferences } = req.body;

    const token = req.headers['authorization']?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;
  
   
      const user = await User.findOne({ where: { id: userId } });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update profile fields
      if (name) user.name = name;
      if (bio) user.bio = bio;
      if (profilePicture) user.profilePicture = profilePicture;
      if (preferences) user.preferences = preferences;
  
      await user.save();
  
      res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
  
  module.exports = { updateProfile };
  


const updateProfilePicture = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
      await user.save();
      res.status(200).json({ message: 'Profile picture updated successfully', profilePicture: user.profilePicture });
    } else {
      res.status(400).json({ message: 'No file uploaded' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile picture' });
  }
};

const googleAuth = (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { failureRedirect: '/login' }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ message: 'Authentication failed' });
    }

    // Generate JWT token for the user
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  })(req, res, next);
};


// const googleLogin = async (req, res) => {
//   const { token } = req.body;

//   if (!token) {
//     return res.status(400).json({ message: 'Google token is required' });
//   }

//   try {
//     // Verify the token with Google's API
//     const googleResponse = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
//     const { email, name, picture } = googleResponse.data;

//     // Check if the user already exists in the database
//     let user = await User.findOne({ where: { email } });

//     if (!user) {
//       // Create a new user if not found
//       user = await User.create({
//         name,
//         email,
//         profilePicture: picture,
//         password: '',
//       });
//     }

//     // Generate JWT token
//     const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.status(200).json({ message: 'Google login successful', token: jwtToken });
//   } catch (error) {
//     console.error('Google token verification failed:', error);
//     res.status(500).json({ message: 'Google login failed' });
//   }
// };

const googleLogin = async (req, res) => {
  const { token } = req.body;

  console.log("Received Google token:", token);  

  if (!token) {
    console.error("Google token is missing");  
    return res.status(400).json({ message: 'Google token is required' });
  }

  try {
    // Verify the token with Google's API
    console.log("Verifying token with Google API...");

    const googleResponse = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    
    console.log("Google API response:", googleResponse.data);  

    const { email, name, picture } = googleResponse.data;

    // Check if the user already exists in the database
    console.log("Checking if user exists in database with email:", email);

    let user = await User.findOne({ where: { email } });

    if (!user) {
      console.log("User not found, creating a new user...");
      // Create a new user if not found
      user = await User.create({
        name,
        email,
        profilePicture: picture,
        password: '', 
      });
    } else {
      console.log("User found in database:", user);  
    }

    
    console.log("Generating JWT token for user:", user.id);
    const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log("JWT Token generated:", jwtToken);  
    res.status(200).json({ message: 'Google login successful', token: jwtToken });
  } catch (error) {
    console.error('Google token verification failed:', error); 
    res.status(500).json({ message: 'Google login failed' });
  }
};


module.exports = { googleLogin, registerUser, loginUser, getProfile, updateProfile, updateProfilePicture, googleAuth, googleAuthCallback };
