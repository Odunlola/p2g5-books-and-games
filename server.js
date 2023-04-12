//importing dependencies
require("dotenv").config()
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const PORT = process.env.PORT;
const { Products } = require("./models");
// setting up controller
const productController = require("./controllers/products")

//middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:false}));
app.use(express.static("public"));
app.use(methodOverride("_method"));

//Routes
// app.get('/', (req,res)=>{
//     res.send("Hello world!")
// })

app.get("/", async (req, res, next) => {
    try {
        // using Products for now
        const products = await Products.find({});
        res.render("products/home", { products })
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

app.use("/products", productController);
// Controller Router

//server listener
app.listen(PORT, ()=>{
    console.log(`Now listening on port ${PORT} Ω🔌 🔌Ω`);
});
