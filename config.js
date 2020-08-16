const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  mongoDbUrl: process.env.MONGODB_URL,
  port: process.env.PORT,
  salt: process.env.SALT
};