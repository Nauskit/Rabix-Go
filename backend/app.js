const express = require('express');
const bodyPaser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db')
const app = express();

app.use(bodyPaser.json());
app.use(cors());
connectDB();


module.exports = app;