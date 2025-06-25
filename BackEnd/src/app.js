const express = require('express');
const cors = require('cors');
const reviewRoute = require('../routes/review');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Use the /review route
app.use('/review', reviewRoute);

module.exports = app;
