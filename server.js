require("dotenv").config()
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const PORT = process.env.PORT;

app.set("view engine", "ejs");

app.use(express.urlencoded({extended:false}));
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.get('/', (req,res)=>{
    res.send("Hello world!")
})

app.listen(PORT, ()=>{
    console.log(`Now listening on port ${PORT} Ω🔌 🔌Ω`);
});