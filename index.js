const connectToMongo=require('./db');
const express=require('express');
const cors=require('cors');
connectToMongo();

const app=express();
app.use(cors());
app.use(express.json());
const port=5000;

app.get('/',(req,res)=>{
    res.send("This is a Home page");
})
app.use('/auth',require('./routes/auth'));
app.use('/notes',require('./routes/notes'));

app.listen(port,(req,res)=>{
    console.log(`this app is running at http://localhost:${port}`);
});