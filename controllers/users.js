const express = require("express");
const router = express.Router();
const {Users} = require("../models");
const bcrypt = require("bcrypt");

router.get("/login",(req,res,next)=>{
    try {
        res.render("users/login");
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

router.get("/signup",(req,res,next)=>{
    try {
        res.render("users/signup");
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

router.post("/signup",async(req,res,next)=>{
    try {
        const newUser = req.body;
        const rounds=parseInt(process.env.SALT_ROUNDS);
        const salt = await bcrypt.genSalt(rounds);
        const hash = await bcrypt.hash(newUser.password,salt);
        newUser.password=hash
        await Users.create(newUser);
        res.redirect("/login");
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

module.exports=router