const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");



///add books---admin//api
router.post("/add-books", authenticateToken , async (req, res)=>{
    try{
        const { id } = req.headers;
        const user = await User.findById(id);
        if(user.role !== "admin"){
           return res.status(500)
           .json({message: "you are not admin "});  
        }
        const book = new Book({
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            desc: req.body.desc,
            price: req.body.price,
            language: req.body.language,
        });  
        await book.save();
        res.status(200).json({message: "book created succesfully"});
    }catch(error){
        res.status(500).json({message: "internal server error"});
    }
});  
// making api of updation of the book--admin

router.put("/update-book" , authenticateToken, async (req, res)=>{ 
    try {
        const { bookid } = req.headers;
        await Book.findByIdAndUpdate( bookid, {
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            desc: req.body.desc,
            price: req.body.price,
            language: req.body.language,
        });
        return res.status(200).json({message:"book updated succefully"});
    } catch (error) {
      console.log(error);
      return res.status(500).json({message: "an error occured"});  
    }
});

// making delete API of book 
router.delete("/delete-book", authenticateToken , async(req, res)=>{
    try {

        const {bookid} = req.headers;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({message:"book deleted succeffuly"});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"an errer occured"});
        
    }
});
//get-book - all
router.get("/get-book-data", async(req, res)=>{
    try {
        const books = await Book.find().sort({createdAt: -1}) 
        return res.json({
            status: "succes",
            data: books,
        });
    
    } catch (error) {
        return res.status(500).json({message: "error occured"});
    }
});

//get-recently-added-book-data ----limit 4 books
router.get("/get-recently-added-book", async(req, res)=>{
    try {
        const books = await Book.find().sort({createdAt: -1}).limit(4);
        return res.json({
            status: "succes",
            data: books,
        });
    
    } catch (error) {
        return res.status(500).json({message: "error occured"});
    }
});

//get book by id

router.get("/get-book-by-id/:id", async(req, res)=>{
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        return res.json({
            status: "'success",
            data: book,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "error occured"});
    }
});
module.exports = router;