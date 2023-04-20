// setting up express as a router
const express = require("express");
const router = express.Router();

const seededData = require("../models/seededData");

// linking products model
const { Products,Users, Comments } = require("../models");

function checkCurrUser(req){
    if (typeof req.session.currentUser !== "undefined") {
        return req.session.currentUser.username;
    } else{
        return "Guest";
    }
}

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
        res.render("products/index", { products, type, user:checkCurrUser(req) })
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
        res.render("products/new",{user:checkCurrUser(req)});
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
        if (typeof req.session.currentUser !=="undefined" && req.session.currentUser.id === product.user.toString()){
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

        res.render("products/show", { product,usersProducts,productComments,productCommentUsernames,user:checkCurrUser(req) });
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// get edit page route
router.get("/:id/edit", async (req, res, next) => {
    try {
        if (typeof req.session.currentUser === "undefined"){
            res.send(`We don't have a 404 page, so you'll have to settle with this.<h1>404</h1>`)
            return 0;
        }
        const product = await Products.findById(req.params.id);
        if (typeof req.session.currentUser.id==="undefined"){
            res.redirect("/login?privilege");
            return 0;
        }else if (req.session.currentUser.id!==product.user){
            res.send(`We don't have a 404 page, so you'll have to settle with this.<h1>404</h1>`)
            return 0;
        }else{
            res.render("products/edit", { product,user:checkCurrUser(req) });
        }
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
        res.render("products/delete", { product,user:checkCurrUser(req) });
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// new post route 
router.post("/", async (req, res, next) => {
    try {
        if (!req.session.currentUser.id){
            res.send(`We don't have a 404 page, so you'll have to settle with this.<h1>404</h1>`)
        }
        let newProd = req.body;
        newProd.user = req.session.currentUser.id;
        newProd = await Products.create(newProd);
        res.redirect(`/products/${newProd._id}`)
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// edit (put) route - designed for testing for now
router.put("/:id", async (req, res, next) => {
    try {
        if (typeof req.session.currentUser === "undefined"){
            res.send(`We don't have a 404 page, so you'll have to settle with this.<h1>404</h1>`)
            return 0;
        }
        const product = await Products.findById(req.params.id);
        if (req.session.currentUser.id!==product.user){
            res.send(`We don't have a 404 page, so you'll have to settle with this.<h1>404</h1>`)
            return 0;
        }
        const updatedProd = await Products.findByIdAndUpdate(req.params.id, req.body);
        res.redirect(`/products/${req.params.id}`)
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// delete route - one at a time
router.delete("/:id", async (req, res, next) => {
    try {
            const product = await Products.findById(req.params.id);
        if (req.session.currentUser.id!==product.user){
            res.send(`We don't have a 404 page, so you'll have to settle with this.<h1>404</h1>`)
            return 0;
        }
        await Products.findByIdAndDelete(req.params.id);
        res.redirect("/products");
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

module.exports = router;