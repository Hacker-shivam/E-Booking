const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth.js')
const eventRoutes = require('./routes/events.js')
const bookingRoutes = require('./routes/booking.js')

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes)
app.use('/api/bookings', bookingRoutes)

// Connect to mongodb

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('connected to DB');
}).catch((err) => {
    console.log('Error in connection', err);
    
});


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`server run on ${PORT}`)
})