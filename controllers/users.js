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

module.exports=router