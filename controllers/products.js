// setting up express as a router
const express = require("express");
const router = express.Router();

const seededData = require("../models/seededData");

// linking products model
const { Products } = require("../models");

// index route
router.get("/", async (req, res, next) => {
    try {
        let products;
        let type = "";
        let searchQuery = req.query.s;
        if ((typeof req.query.type === "undefined") || (req.query.type === "")) {
            // searching thru all the products with a title that contains the series of searchQuery
            // if sQ is empty, products should return everything
            products = await Products.find({ name: { $regex: new RegExp(searchQuery, "i") } });
        } else {
            // getting and formatting type
            type = req.query.type;
            type = type[0].toUpperCase() + type.slice(1, type.length);
            // type = type.charAt(0).toUpperCase()+type.slice(1);
            // console.log(type);

            // searching thru all the products with a title that contains the series of searchQuery
            // and a matching type
            // if sQ is empty, products should return everything w/ matching type
            products = await Products.find({ productType: type, name: { $regex: new RegExp(searchQuery, "i") } });
        }
        res.render("products/index", { products, type })
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// seed route
router.get("/seed", async (req, res, next) => {
    try {
        await Products.deleteMany({});
        await Products.insertMany(seededData);
        res.redirect("/products");
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// new route
router.get("/new", async (req, res, next) => {
    try {
        // await res.send(`Working! You are on the products' new page!`);
        res.render("products/new");
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// show route
router.get("/:id", async (req, res, next) => {
    try {
        // await res.json(await Products.findById(req.params.id));
        const product = await Products.findById(req.params.id);
        res.render("products/show", { product });
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// get edit page route
router.get("/:id/edit", async (req, res, next) => {
    try {
        // await res.json(await Products.findById(req.params.id));
        const product = await Products.findById(req.params.id);
        res.render("products/edit", { product });
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// delete confirmation route
router.get("/:id/delete", async (req, res, next) => {
    try {
        // await res.json(await Products.findById(req.params.id));
        const product = await Products.findById(req.params.id);
        res.render("products/delete", { product });
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// new post route - designed for testing for now
router.post("/", async (req, res, next) => {
    try {
        const newProd = await Products.create(req.body);
        // await res.json(newProd);
        res.redirect(`/products/${newProd._id}`)
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// edit (put) route - designed for testing for now
router.put("/:id", async (req, res, next) => {
    try {
        const updatedProd = await Products.findByIdAndUpdate(req.params.id, req.body);
        await res.redirect(`/products/${req.params.id}`)
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// delete route - one at a time
router.delete("/:id", async (req, res, next) => {
    try {
        await Products.findByIdAndDelete(req.params.id);
        res.redirect("/products");
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

module.exports = router;