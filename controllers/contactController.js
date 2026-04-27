const Contact = require("../models/ContactModel");

exports.createContact = async(req,res)=>{

try{

const newContact = new Contact(req.body);

await newContact.save();

res.status(200).json({

message:"Saved successfully"

});

}catch(err){

res.status(500).json({

error:"Server error"

});

}

};