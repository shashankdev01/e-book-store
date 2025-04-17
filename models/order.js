const mongoose = require("mongoose");
const order = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
    },
    book: {
        type: mongoose.Types.ObjectId,
        ref: "books",
    },
    status: {
        type: mongoose.Types.ObjectId,
        ref: "user",
    },
    user: {
        type:  String,
        default: "order placed",
        enum: ["order Placed","out of delivery,canceled"],
    },
},
{timestamps: true}
);
module.exports = mongoose.model("order",order);