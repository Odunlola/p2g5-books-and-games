// setting up express as a router
const express = require("express");
const router = express.Router();

const seededData = require("../models/seededData");

// linking products model
const { Products, Users, Comments } = require("../models");

function checkCurrUser(req) {
    if (typeof req.session.currentUser !== "undefined") {
        return req.session.currentUser.username;
    } else {
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
        res.render("products/index", { products, type, user: checkCurrUser(req) })
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
        res.render("products/new", { user: checkCurrUser(req) });
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// show route
router.get("/:id", async (req, res, next) => {
    try {
        let error;
        switch (req.query.error) {
            case "invalidrating":
                error = "Invalid rating: Rating must be between 1 and 10";
                break;
            default:
                break;
        }

        const product = await Products.findById(req.params.id);

        // logic for getting and passing in comments

        let productComments = await Comments.find({ product: req.params.id }); //name for parity with views

        let productCommentUsernames = []; //parity
        for (let i = 0; i < productComments.length; i++) {
            const comment = productComments[i];
            const commenter = await Users.findById(comment.user);
            productCommentUsernames[i] = (commenter.username);
        }

        res.render("products/show", { product, productComments, productCommentUsernames, user: checkCurrUser(req), error });
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// get edit page route
router.get("/:id/edit", async (req, res, next) => {
    try {
        const product = await Products.findById(req.params.id);
        if (typeof req.session.currentUser.id === "undefined") {
            res.redirect("/login?error=privilege");
            return 0;
        } else if (req.session.currentUser.id !== product.user.toString()) {
            res.send(`<h1>It appears you can't do that.</h1>`)
            return 0;
        } else {
            res.render("products/edit", { product, user: checkCurrUser(req) });
        }
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// delete confirmation route
router.get("/:id/delete", async (req, res, next) => {
    try {
        const product = await Products.findById(req.params.id);
        if (typeof req.session.currentUser.id === "undefined") {
            res.redirect("/login?error=privilege");
            return 0;
        } else if (req.session.currentUser.id !== product.user.toString()) {
            res.send(`<h1>It appears you can't do that.</h1>`)
            return 0;
        }
        res.render("products/delete", { product, user: checkCurrUser(req) });
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// new post route 
router.post("/", async (req, res, next) => {
    try {
        if (typeof req.session.currentUser.id === "undefined") {
            res.redirect("/login?error=privilege");
            return 0;
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
        const product = await Products.findById(req.params.id);
        if (typeof req.session.currentUser.id === "undefined") {
            res.redirect("/login?error=privilege");
            return 0;
        } else if (req.session.currentUser.id !== product.user.toString()) {
            res.send(`<h1>It appears you can't do that.</h1>`)
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
        if (typeof req.session.currentUser.id === "undefined") {
            res.redirect("/login?error=privilege");
            return 0;
        } else if (req.session.currentUser.id !== product.user.toString()) {
            console.log(req.session.currentUser.id, product.user)
            res.send(`<h1>It appears you can't do that.</h1>`)
            return 0;
        }
        await Products.findByIdAndDelete(req.params.id);
        res.redirect("/products");
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

router.post("/:id/comments", async (req, res, next) => {
    try {
        let newComment = req.body;
        if ((parseFloat(newComment.rating) > 10) || (parseFloat(newComment.rating) < 1)) {
            res.redirect(`/products/${req.params.id}?error=invalidrating`);
        }
        newComment.user = req.session.currentUser.id;
        newComment.product = req.params.id;
        await Comments.create(newComment);
        res.redirect(`/products/${req.params.id}`);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

module.exports = router;