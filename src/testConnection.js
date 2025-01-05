const { sequelize } = require('./config/database');
const User = require('./models/user');

const testConnection = async () => {
    try {
       
        await sequelize.authenticate();
        console.log('Database connection successful.');

        
        await sequelize.sync({ alter: true });
        console.log('Database tables synced.');

       
        const testUser = await User.create({
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'securepassword',
            bio: 'This is a test bio.',
            preferences: { showEmptySpaces: true },
        });

        console.log('Test user created:', testUser.toJSON());

        
        const users = await User.findAll();
        console.log('Users in database:', users.map(user => user.toJSON()));

       
        await testUser.destroy();
        console.log('Test user deleted successfully.');
    } catch (err) {
        console.error('Database connection or CRUD test failed:', err.message);
    } finally {
        
        await sequelize.close();
        console.log('Database connection closed.');
    }
};

testConnection();
