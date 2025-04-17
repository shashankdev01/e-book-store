const express  = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();
require("./conn/conn");



const User = require("./routes/user");
const Books = require("./routes/book");
const Favourite = require("./routes/favourite")
const Cart = require("./routes/cart");
const Order = require("./routes/order");

//routes 
app.use(express.json());
app.use(cors());
//routes

app.use("/api/v1", User);
app.use("/api/v1", Books);
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);
//creating the port 
app.listen(process.env.PORT, ()=>{
    console.log(`server is running at port ${process.env.PORT}`);
});