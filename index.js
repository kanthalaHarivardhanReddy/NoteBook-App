const connectToMongo=require('./db');
const express=require('express');

connectToMongo();

const app=express();
app.use(express.json());
const port=5000;

app.get('/',(req,res)=>{
    res.send("This is a Home page");
})
app.use('/auth',require('./routes/auth'));
app.use('/notes',require('./routes/notes'));

app.listen(port,(req,res)=>{
    console.log(`this app is running at https://localhost:${port}`);
});