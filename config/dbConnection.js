const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.connection_string)
        console.log("The connection has been set up", connect.connection.host, connect.connection.name)
    } catch (err) {
        console.log(err)
       process.exit(1); 
    }
};

module.exports = connectDb;