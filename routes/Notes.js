const express=require('express');
const router = express.Router();

const Notes=require('../models/Notes');

router.use('/notes',(req,res)=>{
    res.send("HElllo");
});

module.exports=router;