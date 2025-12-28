const mongoose = require('mongoose');
const { Pool } = require('pg');
require('dotenv').config();

// MongoDB connection
const connectMongo = async () => {
    console.log("...Connecting to MongoDB...");
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Failed:', err.message);
        process.exit(1);
    }
};

// PostgreSQL pool
console.log("...Initializing PostgreSQL pool...");
const pgPool = new Pool({
    connectionString: process.env.PG_URI,
});

pgPool.on('connect', () => {
    console.log("...PostgreSQL client connected...");
});

pgPool.on('error', (err) => {
    console.error('PostgreSQL Pool Error:', err);
});

module.exports = { connectMongo, pgPool };