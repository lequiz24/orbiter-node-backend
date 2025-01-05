const axios = require('axios');

const fetchRandomParticipants = async (count = 5) => {
  const response = await axios.get(`https://randomuser.me/api/?results=${count}`);
  return response.data.results.map((user) => ({
    name: `${user.name.first} ${user.name.last}`,
    email: user.email,
    location: user.location,
    imageUrl: user.picture.thumbnail,
    participantId:user.login.uuid,
  }));
};

module.exports = { fetchRandomParticipants };
