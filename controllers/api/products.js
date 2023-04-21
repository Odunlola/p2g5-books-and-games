// setting up express as a router
const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt")

const seededData = require("../../models/seededData");

// linking products model
const { Products, Users } = require("../../models");

// funct for checking credentials
// for API, the user must send their email and pass for post, put, delete functions
// this function will send verification (in the form of the user's id) if user has correct credentials
async function checkCredent(email, pass) {
    try {
        let user;
        const userExists = await Users.exists({ email });
        // if the user does not exist, return empty string
        if (!userExists) {
            return "";
        }
        // this code should only run if the sent email has assoc. account
        user = await Users.findOne({ email });

        // compare passwords
        const match = await bcrypt.compare(pass, user.password);
        // if password matches, return the user id as authentication verification
        // if not, return empty string
        if (match) {
            return user._id.toString();
        } else {
            return "";
        }
    } catch (error) {
        return "";
    }
}

// index api
router.get("/", async (req, res, next) => {
    try {
        // send all products
        const products = await Products.find({});
        res.json({ products, status: res.statusCode });
    } catch (error) {
        console.log(error);
        res.json({ status: res.statusCode, errors: error.errors });
    }
});

// show route
router.get("/:id", async (req, res, next) => {
    try {
        const product = await Products.findById(req.params.id);
        res.json({ product, status: res.statusCode });
    } catch (error) {
        console.log(error);
        res.json({ status: res.statusCode, errors: error.errors });
    }
})

// new post route
router.post("/", async (req, res, next) => {
    try {
        // if user does not send credentials, send error
        if (typeof req.body.email === "undefined" || typeof req.body.password === "undefined") {
            res.json({ msg: "Invalid credentials", status: res.statusCode })
            return 0;
        }
        // if user does not send correct credentials, send error
        const userID = await checkCredent(req.body.email, req.body.password);
        if (!userID) {
            res.json({ msg: "Invalid credentials", status: res.statusCode })
            return 0;
        }
        // this code should only run when credentials are correct
        // alright, make the product
        req.body.user = userID;
        const newProd = await Products.create(req.body);
        res.json({ newProd, status: res.statusCode });
    } catch (error) {
        console.log(error);
        res.json({ status: res.statusCode, errors: error.errors });
    }
})

// edit (put) route
router.put("/:id", async (req, res, next) => {
    try {
        // if user does not send credentials, send error
        if (typeof req.body.email === "undefined" || typeof req.body.password === "undefined") {
            res.json({ msg: "Invalid credentials", status: res.statusCode })
            return 0;
        }

        // if user does not send correct credentials, send error
        const userID = await checkCredent(req.body.email, req.body.password);
        console.log(userID)
        const prodToUpd = await Products.findById(req.params.id)
        if (userID !== prodToUpd.user.toString()) {
            res.json({ msg: "Invalid credentials", status: res.statusCode })
            return 0;
        }

        // this code should onjly run if credentials are correct and authorized
        const updatedProduct = await Products.findByIdAndUpdate(req.params.id, req.body);
        res.json({ updatedProduct, status: res.statusCode });
    } catch (error) {
        console.log(error);
        res.json({ status: res.statusCode, errors: error.errors });
    }
})

// delete route - one at a time
router.delete("/:id", async (req, res, next) => {
    try {
        // if user does not send credentials, send error
        if (typeof req.body.email === "undefined" || typeof req.body.password === "undefined") {
            res.json({ msg: "Invalid credentials", status: res.statusCode })
            return 0;
        }
        // if user does not send correct credentials, send error
        const userID = await checkCredent(req.body.email, req.body.password);
        const prodToUpd = await Products.findById(req.params.id)
        if (userID !== prodToUpd.user.toString()) {
            res.json({ msg: "Invalid credentials", status: res.statusCode })
            return 0;
        }
        // this code should onjly run if credentials are correct and authorized
        await Products.findByIdAndDelete(req.params.id);
        const products = await Products.find({});
        res.json({ products, status: res.statusCode });
    } catch (error) {
        console.log(error);
        res.json({ status: res.statusCode, errors: error.errors });
    }
})

// checking if email and pass are defined are separate to avoid undefined error since credential checking takes email and pass directly instead of a req

module.exports = router;