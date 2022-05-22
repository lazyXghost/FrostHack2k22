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
    products: [
        {
            productID: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
            }
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
    status: {
        type: String,
        required: true,
        default: "pending"
    }
    // every quantity has a name , quantity and price associated with it.
});

module.exports = mongoose.model("Orders", OrderSchema);