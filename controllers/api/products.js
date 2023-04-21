// setting up express as a router
const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt")

const seededData = require("../../models/seededData");

// linking products model
const { Products, Users } = require("../../models");

// funct for checking credentials
async function checkCredent(email, pass) {
    try {
        let user;
        const userExists = await Users.exists({ email });
        if (!userExists) {
            return "";
        }
        user = await Users.findOne({ email });
        const match = await bcrypt.compare(pass, user.password);
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
        // await res.json(await Products.findById(req.params.id));
    } catch (error) {
        console.log(error);
        res.json({ status: res.statusCode, errors: error.errors });
    }
})

// new post route
router.post("/", async (req, res, next) => {
    try {
        if (typeof req.body.email === "undefined" || typeof req.body.password === "undefined") {
            res.json({ msg: "Invalid credentials", status: res.statusCode })
            return 0;
        }
        const userID = await checkCredent(req.body.email, req.body.password);
        if (!userID) {
            res.json({ msg: "Invalid credentials", status: res.statusCode })
            return 0;
        }
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
        if (typeof req.body.email === "undefined" || typeof req.body.password === "undefined") {
            res.json({ msg: "Invalid credentials", status: res.statusCode })
            return 0;
        }
        const userID = await checkCredent(req.body.email, req.body.password);
        console.log(userID)
        const prodToUpd = await Products.findById(req.params.id)
        if (userID !== prodToUpd.user.toString()) {
            res.json({ msg: "Invalid credentials", status: res.statusCode })
            return 0;
        }
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
        if (typeof req.body.email === "undefined" || typeof req.body.password === "undefined") {
            res.json({ msg: "Invalid credentials", status: res.statusCode })
            return 0;
        }
        const userID = await checkCredent(req.body.email, req.body.password);
        const prodToUpd = await Products.findById(req.params.id)
        if (userID !== prodToUpd.user.toString()) {
            res.json({ msg: "Invalid credentials", status: res.statusCode })
            return 0;
        }
        await Products.findByIdAndDelete(req.params.id);
        const products = await Products.find({});
        res.json({ products, status: res.statusCode });
    } catch (error) {
        console.log(error);
        res.json({ status: res.statusCode, errors: error.errors });
    }
})

module.exports = router;