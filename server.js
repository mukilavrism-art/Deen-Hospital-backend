const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

require("dotenv").config();


const app = express();

app.use(cors());

app.use(express.json());


// DB connect

mongoose.connect(process.env.MONGO_URL)

.then(()=>console.log("MongoDB Connected"))

.catch(err=>console.log(err));


// route import

const contactRoutes = require("./routes/contactRoutes");


// route use

app.use("/api/contact",contactRoutes);


// test route

app.get("/",(req,res)=>{

res.send("API running");

});


app.listen(process.env.PORT,()=>{

console.log("Server running");

});