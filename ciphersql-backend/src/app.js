const express = require('express');
const cors = require('cors');
const { connectMongo } = require('./config/db');
const assignmentRoutes = require('./routes/assignmentRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json()); // Parse incoming JSON

// Connect Database
connectMongo();

// Routes
app.use('/api/assignments', assignmentRoutes);

// Health Check
app.get('/', (req, res) => res.send('CipherSQL Backend is Running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));