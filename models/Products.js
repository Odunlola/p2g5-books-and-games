const mongoose = require("../config/connection");

//pull schema and model from mongoose
const productSchema = new mongoose.Schema(
    {
        name:String,
        author:String,
        price:Number,
        image:String,
        productType:String
    },{
        timestamps:true
    }
);

const Products = mongoose.model("Products", productSchema);
module.exports = Products;