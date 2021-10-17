const mongoose = require('mongoose');

//connect to mongo DB atlas
const mongoURI=process.env.DATABASE;

const connectToMongo=()=>{
    // mongoose.connect(mongoURI).then(()=>{
    //     console.log("Connection Successfull");
    // }).catch((err)=>{console.log(err)});
    mongoose.connect(mongoURI,
        err => {
            if(err) throw err;
            console.log('connected to MongoDB')
        });
};



module.exports=connectToMongo;