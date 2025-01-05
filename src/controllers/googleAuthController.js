const passport = require('passport');
const jwt = require('jsonwebtoken');


// Initiate Google Authentication
const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});



const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err) {
      console.error("Authentication error: ", err); // log the error for debugging
      return res.status(401).json({ message: 'Google Authentication failed', error: err });
    }
    if (!user) {
      console.log("No user found");
      return res.status(401).json({ message: 'Google Authentication failed' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Login successful', token });
  })(req, res, next);
};


module.exports = { googleAuth, googleAuthCallback };
