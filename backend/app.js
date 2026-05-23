const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db')
const authrouter = require('./routers/authRouter')
const restaurantRouter = require('./routers/restaurantRouter')
const app = express();

app.use(express.json());
app.use(cors());
connectDB();

app.use('/auth', authrouter)
app.use('/restaurants', restaurantRouter)



module.exports = app;