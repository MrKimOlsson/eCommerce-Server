// Import
require('dotenv').config();
const express = require('express')    // Import express, a light-weight framework
const app = express()                 // Init express, and save it in "app" variable
const mongoose = require('mongoose'); // Import mongoose, a tool that gives NoSQL DB (such as Mongodb), the ablilities of a relational DB (such MySQL)
const corse = require('cors');
const helmet = require('helmet');

//Middleware
app.use(corse());           // Allow cross-origin requests 
app.use(helmet());          // Protection. Needs explanation
app.use(express.json());    // Formats data to Json

// Import and use routes
const productRouter = require('./routes/products');
const orderRouter = require('./routes/orders');
const userRouter = require('./routes/users');
app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/users', userRouter);

// Connect to your own DB
mongoose.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {console.log('DB connected')}
)

// Listen to server
app.listen(process.env.PORT || 5000); //Listen through port 5000