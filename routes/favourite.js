const router = require("express").Router();
const User = require("../models/user");
const { route } = require("./user");
const { authenticateToken } = require("./userAuth");

// add book to favourite
router.put("/add-favourite-book", authenticateToken, async(req, res)=>{
    try {
        const { bookid, id } = await req.headers;
        const userData = await User.findById(id);
        const isBookFavourite = userData.favourites.includes(bookid);
        if(isBookFavourite){
            return res.status(200).json({message: "book is already in favourites"});

        } 
        await User.findByIdAndUpdate(id, {$push:{favourites:bookid}});

        return res.status(200).json({message: "book is added in favourites"});


    } catch (error) {
        res.status(500).json({message: "internal server error"});
    }
}); 
//delete of favourite book----api

router.put("/delete-favourite-book", authenticateToken, async(req, res)=>{
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
        const isBookFavourite = userData.favourites.includes(bookid);
        if(isBookFavourite){
            await User.findByIdAndUpdate(id, {$pull:{favourites:bookid}});
        } 
        
        return res.status(200).json({message: "book is removed from favourites"});


    } catch (error) {
        res.status(500).json({message: "internal server error"});
    }
});

// fetching all favourite book of user by user id and book id ---api
router.get("/get-favourite-books", authenticateToken, async (req, res)=>{
   try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate("favourites");
        const favouriteBooks = userData.favourites;
         return res.json({
            status: "Success",
            data: favouriteBooks,
            });
 } catch (error) {
    console.log(error);
    return res.status(500).json({message:"an error occured"});
  }
});

//
module.exports = router;
