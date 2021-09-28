const mongoose=require('mongoose');

const mongoURI="mongodb://localhost:27017/Notebook?readPreference=primary&appname=MongoDB%20Compass&ssl=false";

const connectToMongo=()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("Successfully connected to mongo");
    })
};

module.exports=connectToMongo;