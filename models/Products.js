const mongoose = require("../config/connection");

//making Product Schema
const productSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true, "Please enter a name."]
        },
        author:{
            type:String,
            default:"anonymous"
        },
        price:{
            type:Number,
            required:[true, "Please enter a price."]
        },
        image:{
            type:String
        },
        productType:{
            type:String,
            required:[true, "either Book for Game"]
        }
    },{
        timestamps:true
    }
);

//make Products model
const Products = mongoose.model("Products", productSchema);
module.exports = Products;
