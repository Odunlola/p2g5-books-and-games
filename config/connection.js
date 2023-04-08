require("dotenv").config();
//connecting to mongoose
const mongoose = require("mongoose");
//getting MONGO_DB_URI
const connectionString = process.env.MONGO_DB_URI;
mongoose.connect(connectionString);

