// setting up express as a router
const express = require("express");
const router = express.Router();

// linking products model
const {Products} = require("../models");

// index route
router.get("/",async(req,res,next)=>{
    try {
        // await res.send(`Working! You are on the products' index!`);
        // using Products for now
        const products = await Products.find({});
        res.render("products/index",{products})
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// new route
router.get("/new",async(req,res,next)=>{
    try {
        // await res.send(`Working! You are on the products' new page!`);
        res.render("products/new");
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// show route
router.get("/:id",async(req,res,next)=>{
    try {
        // await res.json(await Products.findById(req.params.id));
        const product = await Products.findById(req.params.id);
        res.render("products/show",{product});
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// new post route - designed for testing for now
router.post("/",async(req,res,next)=>{
    try {
        const newProd = await Products.create(req.body);
        await res.json(newProd);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// edit (put) route - designed for testing for now
router.put("/:id",async(req,res,next)=>{
    try {
        const updatedProd = await Products.findByIdAndUpdate(req.params.id,req.body);
        // NOTE: the object does update, but it sends the json before the update, no idea why or on how to fix
        // it'll probably be fixed by a redirect to a proper show page anyways
        // wait i'm stupid
        // await res.json(await updatedProd);
        await res.redirect(`/products/${req.params.id}`)
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

module.exports = router;