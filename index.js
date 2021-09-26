const connectToMongo=require('./db');
const express=require('express');

connectToMongo();

const app=express();
const port=3000;

app.get('/',(req,res)=>{
    let a={
        ball:"stumper",
        bat:"kukaboora"
    }
    res.send(a);
})

app.listen(port,(req,res)=>{
    console.log(`this app is running at https://localhost:${port}/`);
})