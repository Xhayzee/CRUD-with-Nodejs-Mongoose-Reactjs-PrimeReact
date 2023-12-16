const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    mongo: {
        // uri: `${process.env.NODE_ENV === 'development' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI} + ${process.env.DATABASE_NAME}`,
        uri: process.env.NODE_ENV === 'development' ? process.env.MONGO_URI_TEST + process.env.DATABASE_NAME : process.env.MONGO_URI,
        options: {
            // keepAlive: 1000,
            // autoReconnect: true,
            // reconnectTries: 5,
            // reconnectInterval: 3000,
            // useNewUrlParser: true,
            // useCreateIndex: true,
            // useUnifiedTopology: true,
            // useFindAndModify: false,
        },
    },
    // Level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
};
