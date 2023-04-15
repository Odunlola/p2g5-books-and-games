// setting up express as a router
const express = require("express");
const router = express.Router();

const seededData = require("../models/seededData");

// linking products model
const { Products } = require("../models");

// index api
router.get("/", async (req, res, next) => {
    try {
        const products = await Products.find({});
        res.json({products,status:res.statusCode});
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

module.exports=router;