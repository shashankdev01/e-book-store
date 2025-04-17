const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");



// sign up module api
router.post("/sign-up",async(req,res)=>{
    try{
        
        const { username, email, password, address } =req.body;

        //check user name length is more than 4 or not 
        if(username.length < 4){
            return res
            .status(400)
            .json({message:"user name should be greator than 3"});
        }  
        //check the user name is already exists?.....
        const existingUsername = await User.findOne({username: username}); 
        if(existingUsername) {
            return res
            .status(400)
            .json({message:" user name already exists "});
        }
         //check the email is already exists?.....
         const existingEmail = await User.findOne({email: email}); 
         if(existingEmail) {
             return res
             .status(400)
             .json({message:" email already exist"});
         }
         // check password length
         if(password.length <=5 ){
            return res.status(400).json({message: "password length be greator than 5"});
         }
         const hashPass = await bcrypt.hash(password, 12)

         const newUser = new User ({
            username:username,
            email:email,
            password:hashPass ,
            address:address,
        });
        await newUser.save();
        return res.status(200).json({ message:"signup succesfully"});

    }catch (error){
       res.status(500).json({message: "internal server error"});
    }
});
//sign in API making
router.post("/sign-in", async(req,res)=>{
    try{
        
         const {username, password} = req.body;
         const existinguser = await User.findOne({username});

         if(!existinguser){
             res.status(400).json({message: "invalid crredentials"});
         }
          bcrypt.compare(password, existinguser.password, (err, data) => {
            if (data) {
                const authClaims = [
                    { name: existinguser.username },
                    { role: existinguser.role },
                ];
                const token = jwt.sign({ authClaims }, "bookStore2001", {
                    expiresIn: "30d",
                });
                res.status(200).json({
                    id: existinguser.id,
                    role: existinguser.role,
                    token: token
                });
            }
            else {
                res.status(400).json({ message: "invalid username or password" });
            }
        });

    }catch(error){
       res.status(500).json({message: "internal server error"});
    }
}

);

//get user info...
router.get("/get-user-information", authenticateToken, async (req, res) => {
    try{
            const { id } = req.headers;
            const data = await User.findById(id).select('-password');
            return res.status(200).json(data);
    }catch(error){
        res.status(500).json({message: "internal server error"});

    }
});
//  update the Addresss
router.put("/update-address",authenticateToken, async (req, res) => {  
    try{
        const {id} = req.headers;
        const {address} = req.body;
        await User.findByIdAndUpdate(id, {address: address});
        return res.status(200).json({message: "your address is updated succesfully"});
    }catch(error){
        res.status(500).json({message: "internal server error"});
    }
}); 


module.exports = router;
