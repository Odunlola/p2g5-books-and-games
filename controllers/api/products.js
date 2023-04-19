// setting up express as a router
const express = require("express");
const router = express.Router();

const seededData = require("../../models/seededData");

// linking products model
const { Products } = require("../../models");

// index api
router.get("/", async (req, res, next) => {
    try {
        const products = await Products.find({});
        res.json({products,status:res.statusCode});
    } catch (error) {
        console.log(error);
        res.json({status:res.statusCode,error});
    }
});

// show route
router.get("/:id", async (req, res, next) => {
    try {
        const product = await Products.findById(req.params.id);
        res.json({product,status:res.statusCode});
        // await res.json(await Products.findById(req.params.id));
    } catch (error) {
        console.log(error);
        res.json({status:res.statusCode,error});
    }
})

// new post route
router.post("/", async (req, res, next) => {
    try {
        const newProd = await Products.create(req.body);
        res.json({newProd,status:res.statusCode});
    } catch (error) {
        console.log(error);
        res.json({status:res.statusCode,error});
    }
})

// edit (put) route
router.put("/:id", async (req, res, next) => {
    try {
        const updatedProd = await Products.findByIdAndUpdate(req.params.id, req.body);
        res.json({updatedProd,status:res.statusCode});
    } catch (error) {
        console.log(error);
        res.json({status:res.statusCode,error});
    }
})

// delete route - one at a time
router.delete("/:id", async (req, res, next) => {
    try {
        await Products.findByIdAndDelete(req.params.id);
        const products = await Products.find({});
        res.json({products,status:res.statusCode});
    } catch (error) {
        console.log(error);
        res.json({status:res.statusCode,error});
    }
})

module.exports=router;