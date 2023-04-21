// setting up express as a router
const express = require("express");
const router = express.Router();

// index api
router.get("/", async (req, res, next) => {
    try {
        const products = await Products.find({});
        res.json({products,status:res.statusCode});
    } catch (error) {
        console.log(error);
        res.json({status:res.statusCode,errors:error.errors});
    }
});

module.exports=router;