require('dotenv').config();
const { Sequelize } = require('sequelize');


console.log('Database Configuration:');
console.log({
    POSTGRES_DB: process.env.POSTGRES_DB,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_HOST: process.env.POSTGRES_HOST,
});

const sequelize = new Sequelize(
    process.env.POSTGRES_DB,           
    process.env.POSTGRES_USER,         
    process.env.POSTGRES_PASSWORD,    
    {
        host: process.env.POSTGRES_HOST, 
        dialect: 'postgres',            
        logging: console.log,          
    }
);

const testDatabaseConnection = async () => {
    try {
       
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
};

testDatabaseConnection();

module.exports = { sequelize };
