const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db')
const authrouter = require('./routers/authRouter')
const placesRouter = require('./routers/placesRouter')
const reviewRouter = require('./routers/reviewRouter')
const routeRouter = require('./routers/routeRouter')
const app = express();

app.use(express.json());
app.use(cors());
connectDB();

app.use('/auth', authrouter)
app.use('/places', placesRouter)
app.use('/tags', reviewRouter)
app.use('/routes', routeRouter)



module.exports = app;