require("dotenv").config();
//connecting to mongoose
const mongoose = require("mongoose");

//getting MONGO_DB_URI
const connectionString = process.env.MONGO_DB_URI;
mongoose.connect(connectionString);

mongoose.connection.on("connected", ()=>{
    console.log(`${new Date().toLocaleDateString()}--- Mongo connected --- ☺️ ☺️ ☺️`);
});

mongoose.connection.on("disconnected", ()=>{
    console.log("disconnected from Mongoose");
});

mongoose.connection.on("error", (error)=>{
    console.log("MongoDB connection error", (error));
});

//exporting mongoose
module.exports = mongoose;

