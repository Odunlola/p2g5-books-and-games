const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");

router.get("/login", (req, res, next) => {
    try {
        let error;
        switch (req.query.error) {
            case "true":
                error = "Username or password didn't match";
                break;

            case "privilege":
                error = "You need to be logged in to do that."
                break;
        
            default:
                break;
        }
        res.render("users/login",{error});
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

router.get("/signup", (req, res, next) => {
    try {
        res.render("users/signup");
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

router.post("/login", async (req, res, next) => {
    try {
        let user;
        const userExists = await Users.exists({ email: req.body.email });
        if (!userExists) {
            res.redirect("/login?error=true");
            return 0;
        }
        user = await Users.findOne({ email: req.body.email });
        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            req.session.currentUser = {
                id: user._id,
                username: user.username,
            }
            res.redirect("/products");
        } else {
            res.redirect("/login?error=true");
        }
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

router.post("/signup", async (req, res, next) => {
    try {
        const newUser = req.body;
        const rounds = parseInt(process.env.SALT_ROUNDS);
        const salt = await bcrypt.genSalt(rounds);
        const hash = await bcrypt.hash(newUser.password, salt);
        newUser.password = hash
        await Users.create(newUser);
        res.redirect("/login");
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

router.get("/logout", async (req, res, next) => {
    req.session.destroy();
    res.redirect("/login")
})

module.exports = router