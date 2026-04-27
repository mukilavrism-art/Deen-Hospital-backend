const express = require("express");

const router = express.Router();

const Contact = require("../models/ContactModel"); // correct path


router.post("/",async(req,res)=>{

try{

const newContact = new Contact(req.body);

await newContact.save();

res.json({

message:"Saved successfully"

});

}catch(err){

res.status(500).json({

error:"Server error"

});

}

});


module.exports = router;