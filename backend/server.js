const app = require('./app');
const { connectDB } = require('./config/db')


const POST = process.env.POST || 3000;
connectDB();


app.listen(POST, () => {
    console.log(`Server running on port: http://localhost:${POST}`);
})