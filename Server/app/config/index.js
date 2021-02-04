'use strict';

if(process.env.NODE_ENV == 'production')
{
    // offer production stage environment variables

    const MONGO_USER = process.env.MONGO_USER;
    const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
    const MONGO_DB = process.env.MONGO_DB;

    module.exports = 
    {
        host: process.env.host || "" ,
        JWT_ACCESS_SECRET_KEY: process.env.JWT_ACCESS_SECRET_KEY,
        MONGO_DB_URI: `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.ytodu.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`
    }
}
else
{
    // offer development stage settings and data

    const { MONGO_USER, MONGO_PASSWORD, MONGO_DB, JWT_ACCESS_SECRET_KEY } = require('./development.json');

    module.exports = 
    {
        JWT_ACCESS_SECRET_KEY,
        MONGO_DB_URI: `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.ytodu.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`
    }
}