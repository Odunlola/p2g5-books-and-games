const mongoose = require("../config/connection");

//making userSchema
const userSchema = new mongoose.Schema (
    {
        email:{
            type:String,
            required:[true, "Please enter an email"],
            unique:true
        },
        password:{
            type:String,
            required:[true, "Please enter a password"]
        },
        username:{
            type:String,
            required:[true, "Please enter an username"],
            unique:true
        }
    },{
        timestamps:true
    }
);

//make userSchema and exports
const User = mongoose.model("user", userSchema);
module.exports = User;
