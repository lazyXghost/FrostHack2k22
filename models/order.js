const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userID:{
        type: String,
        required: true,
    },
    orderTime: {
        type:Date,
        default:Date.now(),
    },
    productsID: [
        {
            productID: {
                type: String,
                unique: true,
            },
        },
    ],
    orderNumber: {
        type: Number,
        required: true,
    },
    shippingAddress: {
        house:{
            type: String,
            required: true
        },
        street:{
            type: String,
            required: true
        },
        colony:{
            type: String,
            required: true
        },
        pincode: {
            type:Number,
            required:true
        },
        city: {
            type:String,
            required:true
        },
        state: {
            type:String,
            required:true
        }
    },
    // every quantity has a name , quantity and price associated with it.
});

module.exports = mongoose.model("Orders", OrderSchema);