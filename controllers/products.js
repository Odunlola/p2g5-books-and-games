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

// new route
router.get("/new",async(req,res,next)=>{
    try {
        res.send(`Working! You are on the products' new page!`);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// new post route - designed for testing for now
router.post("/",async(req,res,next)=>{
    try {
        const newProd = await Products.create(req.body);
        res.json(newProd);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

module.exports = router;