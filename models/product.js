const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    storeID: {
        type: String,
        required: true,
    },
    categoryID:{
        type:String,
        required:true
    },
    trending: {
        type:Boolean,
        default:false
    },
    topDeal: {
        type:Boolean,
        default:false
    },
    costPrice: {
        type: Number,
        required: true,
    },
    mrp: {
        type:Number,
        required:true
    },
    salePrice: {
        type:Number
    },
    quantity: {
        type:Number,
        required:true,
    },
    description: {
        type:String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default:'pending',
    },
    image: {
        data: Buffer,
        contentType: String
    }
});

module.exports = mongoose.model("Products", ProductSchema);