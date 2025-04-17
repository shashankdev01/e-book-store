const router = require("express").Router();
const User = require("../models/user");
const Order = require("../models/order");
const { authenticateToken } = require("./userAuth");
const Books = require("../models/book");
  

// place order---api
router.post("/place-order", authenticateToken, async (req, res)=>{
    try {
        
        const { id } = req.headers;
        const { order } = req.body;
        for (const orderData of order) {
            const newOrder = new Order({user: id, book: orderData._id});
            const orderDataFromDb = await newOrder.save();
            /// saving data in user model
            await User.findByIdAndUpdate(id,{
                $push: { orders: orderDataFromDb._id},
            });

           

            /// clearing cart

            await User.findByIdAndUpdate(id, {
                 $pull: {cart: orderData._id},
            });
        }
            return res.json({
                status: "success",
                message: "order palced succesfull",
            });

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "an error occured"});    
    }
});

// get-order--history of a user---api

router.get("/get-history-order", authenticateToken, async (req, res)=>{
    try {
        
        const { id} = req.headers;
        const userData = await User.findById(id).populate({
            path: "orders",
            populate: {path: "book"},
        });

        const ordersData = userData.orders.reverse();
        return res.json({
            status: "success",
            data: ordersData,
        });
    } catch (error) {

        console.log(error);
        return res.status(500).json({message: "an error occured"});
        
    }
});

// get-all-orders----api---role----admin,

router.get("/get-all-orders",authenticateToken, async (req, res)=>{
    try {
        const userData = await Order.find().populate({
            path: "book",
        })
        .populate({

            path: "user",
        })
        .short({ createdAt: -1 });
        return res.json({
            status: "Success",
            data: userData,
        })

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "an error occured"});
        
    }
});

/// update -order----role----admin --///--api
router.put("/update-status/:id", authenticateToken, async (req, res)=>{
    try {
        const { id } = req.params;
        await Order.findByIdAndUpdate(id, {status: req.body.status});
        return res.json({
            status: "Success",
            message: "status updated successfully",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "an error occured"});
        
    }
});

module.exports = router;

