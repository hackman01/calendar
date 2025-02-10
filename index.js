const express = require('express');
const app = express();
const calendarRouter = require('./routes/calendar.route')
const influencerRouter = require('./routes/influencer.route')
const orderRouter = require('./routes/order.route')
const userRouter = require('./routes/user.route');
const dotenv = require('dotenv');
const cors = require('cors');

const connectDB = require('./config/database');

dotenv.config();

connectDB();

app.use(cors());
app.use(express.json());



app.use('/api/calendar',calendarRouter);
app.use('/api/influencer',influencerRouter);
app.use('/api/order',orderRouter);
app.use('/api/user',userRouter);


app.listen(8000,()=>{
    console.log("Server started at 8000!")
})