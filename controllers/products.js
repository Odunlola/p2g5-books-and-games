// setting up express as a router
const express = require("express");
const router = express.Router();

// linking products model
const {Products} = require("../models");

// index route
router.get("/",async(req,res,next)=>{
    try {
        res.send(`Working! You are on the products' index!`);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

module.exports = router;