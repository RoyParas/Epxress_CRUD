const express = require('express');
const errHandler = require('./Middleware/errorHandler');
const connectDb = require('./config/dbConnection');
const dotenv = require('dotenv').config();

const app = express();

const port = process.env.port || 5001;
connectDb();
app.use(express.json());
app.use('/api/contacts',require("./routes/contactRoutes"));
app.use('/api/users',require("./routes/userRoutes"));
app.use(errHandler);

app.listen(port,()=>{
    console.log(`Server started on ${port}`);
})