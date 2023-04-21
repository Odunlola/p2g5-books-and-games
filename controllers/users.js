const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");

router.get("/login", (req, res, next) => {
    try {
        // processing error messages based on query (/login?error=case)
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
        res.render("users/login", { error });
    } catch (error) {
        next();
    }
})

router.get("/signup", (req, res, next) => {
    try {
        // processing error messages based on query (/signup?error=case)
        let error;
        switch (req.query.error) {
            case "exists":
                error = "Username or email already exists";
                break;
            default:
                break;
        }
        res.render("users/signup", { error });
    } catch (error) {
        next();
    }
})

router.post("/login", async (req, res, next) => {
    try {
        let user;
        // check if user exists, if not send wrong user or pass error
        const userExists = await Users.exists({ email: req.body.email });
        if (!userExists) {
            res.redirect("/login?error=true");
            return 0;
        }
        // this code should olny run if user exists
        // set user to this user
        user = await Users.findOne({ email: req.body.email });
        // compare passwords, if password match, set currentUser and take them to /products
        // if not, send wrong user/pass error
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
        next();
    }
})

router.post("/signup", async (req, res, next) => {
    try {
        const newUser = req.body;

        if ((newUser.email==="Guest")||(newUser.username==="Guest")||(newUser.email==="guest")||(newUser.username==="guest")){
            res.redirect("/signup?error=guestname");
            return 0;
        }

        // if user exists, send error that email or username already exists
        const userExists = (await Users.exists({ email: req.body.email })) || await Users.exists({ username: req.body.username });
        if (userExists) {
            res.redirect("/signup?error=exists");
            return 0;
        }
        // this code should only run if user does not exist
        // secret salt rounds
        // encrypt password and create new user
        const rounds = parseInt(process.env.SALT_ROUNDS);
        const salt = await bcrypt.genSalt(rounds);
        const hash = await bcrypt.hash(newUser.password, salt);
        newUser.password = hash
        await Users.create(newUser);
        res.redirect("/login");
    } catch (error) {
        next();
    }
})

router.get("/logout", async (req, res, next) => {
    try {
        req.session.destroy();
        res.redirect("/login")
    } catch (error) {
        next();
    }
})

module.exports = router