//importing dependencies
require("dotenv").config()
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const PORT = process.env.PORT;

//middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:false}));
app.use(express.static("public"));
app.use(methodOverride("_method"));

//Routes
app.get('/', (req,res)=>{
    res.send("Hello world!")
})

//server listener
app.listen(PORT, ()=>{
    console.log(`Now listening on port ${PORT} Ω🔌 🔌Ω`);
});
