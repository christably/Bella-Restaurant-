const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/protected', require('./routes/protectedRoute'));

app.get('/', (req, res) => {
    res.send('API is running....');
});

const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
