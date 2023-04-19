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
const apiHome = require("./controllers/api/api");
const productsApi = require("./controllers/api/products");
const session = require("express-session");
const MongoStore = require("connect-mongo");

//middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:false}));
app.use(express.static("public"));

app.use(session({
    // givng mongostore access to the db
    store:MongoStore.create({
        mongoUrl:process.env.MONGO_DB_URI,
    }),
    // secret signature
    secret:process.env.secret,
    // no resaving same sesh or saving uninitted sesh
    resave:false,
    saveUninitialized:false,
    cookie:{
        // 1 day * 24hrs * 60mins * 60secs * 1000ms
        maxAge: 1000*60*60*24*1,
    }
}))

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

// api routes
app.use("/api/",apiHome);
app.use("/api/products",productsApi);

app.use("/products", productController);
// Controller Router

//server listener
app.listen(PORT, ()=>{
    console.log(`Now listening on port ${PORT} Ω🔌 🔌Ω`);
});
