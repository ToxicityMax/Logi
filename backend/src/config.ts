require('dotenv').config();
export default {
    DB_URI: process.env.DB_URI,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: parseInt(process.env.REDIS_PORT, 10)
    // SECRET: process.env.SECRET,
};
