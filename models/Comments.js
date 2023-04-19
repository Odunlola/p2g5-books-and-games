const mongoose = require("../config/connection");
//making Comments mongoose Schema

const commentSchema = new mongoose.Schema (
    {
        rating:{
            type:Number,
            required:[true, "Please have a rating."]
        },
        text:{
            type:String,
            trim:true
            //max
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        },
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"products"
        }

    },{
        timestamps:true
    }
);
//exporting module
const Comments = mongoose.model("comment", commentSchema);
module.exports = Comments;
