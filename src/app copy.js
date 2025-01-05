const express = require('express');
const passport = require('passport');
const dotenv = require('dotenv');
const session = require('express-session');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');  
const activityRoutes = require('./routes/activityRoutes');  
const { sequelize } = require('./config/database');  
const path = require('path');
const { Activity, Participant } = require('./models/associations');








//  associations
require('./models/Activity');
require('./models/Participant');

dotenv.config();
require('./config/passport'); 

const app = express();
app.use(express.json());
app.use(cors());


app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: true,
}));

const corsOptions = {
  origin: ['http://localhost:8080'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, 
};



app.use(passport.initialize());
app.use(passport.session());


app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    
    res.redirect('/dashboard');
  }
);

// Protected Route 
app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: 'Welcome to your dashboard!', user: req.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// User Routes 
app.use('/api/users', userRoutes);
app.use('/api', activityRoutes);


sequelize.sync({ alter: true }).then(() => {
  console.log('Database & tables synced!');
}).catch(err => {
  console.error('Error syncing database:', err.message);
});


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(passport.initialize());
app.use(passport.session());
