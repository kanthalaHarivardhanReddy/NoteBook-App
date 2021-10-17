const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
const connectToMongo=require('./db');
const express=require('express');
const cors=require('cors');

connectToMongo();
const app=express();
app.use(cors());
app.use(express.json());
const PORT=process.env.PORT||5000;

app.use('/auth',require('./routes/auth'));
app.use('/notes',require('./routes/notes'));

app.listen(PORT,(req,res)=>{
    console.log(`this app is running at http://localhost:${PORT}`);
});