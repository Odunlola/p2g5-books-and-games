// setting up express as a router
const express = require("express");
const router = express.Router();

const seededData = require("../models/seededData");

// linking products model
const { Products,Users, Comments } = require("../models");

// index route
router.get("/", async (req, res, next) => {
    try {
        let products;
        let type = "";
        let searchQuery = req.query.s;
        let username;
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
        if (typeof req.session.currentUser !== "undefined") {
            username = req.session.currentUser.username;
        } else{
            username = "Guest";
        }
        res.render("products/index", { products, type, username })
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

        // logic for bool if currentUser owns this product or not
        let usersProducts; //name for parity with views
        // if user is logged in their user id is the same as the assoc. user id for this product...
        if (typeof req.session.currentUser !=="undefined" && req.session.currentUser.id === product.user){
            usersProducts=true;
        }else {
            usersProducts=false;
        }

        // logic for getting and passing in comments

        let productComments = await Comments.find({product:req.params.id}); //name for parity with views

        let productCommentUsernames=[]; //parity
        for (let i = 0; i < productComments.length; i++) {
            const comment = productComments[i];
            productCommentUsernames[i] = Products.findById(comment.user).username;
        }

        res.render("products/show", { product,usersProducts,productComments,productCommentUsernames });
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