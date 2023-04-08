const mongoose = require("../config/connection");

//pull schema and model from mongoose
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

const Products = mongoose.model("Products", productSchema);
module.exports = Products;