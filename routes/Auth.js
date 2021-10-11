const express=require('express');
const router=express.Router();
const User=require('../models/User');
const {body, validationResult}=require('express-validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const fetchuser=require('../middleware/fetchuser');

//secret key of the web token
const JWT_KEY="HEISAGOOD$BOYFORNOW";

//route 1 : for creating a user : POST '/auth/createuser'
router.post('/createuser',[
    //for validating the inputs using express validator
    body('name','Enter a Valid Name').isLength({min:3}),
    body('email','Enter a Valid Email').isEmail(),
    body('password','Password must be atleast 5 characters').isLength({min:5})
],async (req,res)=>{
    try{
        const errors=validationResult(req);
        let success=false;
        if(!errors.isEmpty()){
            return res.status(400).json({success,errors:errors.array()});
        }
        //finding if a user already exists
        let user=await User.findOne({email:req.body.email});

        //creating a user 
        if(user){
            return res.status(400).send({success,msg:'Enter a valid credentials'});
        }
        const salt=await bcrypt.genSalt(10);
        //hashing the password using salt 
        const secrPass=await bcrypt.hash(req.body.password,salt);
        user=await User.create({
            name:req.body.name,
            email:req.body.email,
            password:secrPass
        });
        const data={
            user:{
                id:user.id
            }
        }

        //signing a token using secret key
        const authtoken=jwt.sign(data,JWT_KEY);
        success=true;
        res.send({success,authtoken});

    }catch(err){
        res.status(500).send('Internal Server Error');
    }
});

//route 2 : for logging in the user : POST '/auth/login'
router.post('/login',[
    //for validating the inputs using express validator
    body('email','Enter a Valid Email').isEmail(),
    body('password','Password must be atleast 5 characters').isLength({min:5})
],async (req,res)=>{
    try{
        const errors=validationResult(req);
        let success=false;
        if(!errors.isEmpty()){
            return res.status(400).json({success,errors:errors.array()});
        }
        //finding if a user already exists
        const {email,password}=req.body;
        let user=await User.findOne({email:email});
        console.log(user);

        if(user===null){
            return res.status(400).send({success,msg:'User not yet registered! please register first'});
        }
        const login=await bcrypt.compare(password,user.password);
        if(login){
            console.log("login Successfull");
            const data={
                user:{
                    id:user.id
                }
            }
            const authtoken=jwt.sign(data,JWT_KEY);
            success=true;
            res.send({success,authtoken});
        }
        else{
            console.log("login failed");
            return res.status(400).send({success,msg:'Enter a valid credentials'});
        }
        
    }catch(err){
        res.status(500).send('Internal Server Error'+err)
    }   
});

//route 3 : for fetching the details of a user : POST '/auth/getuser'
router.post('/getuser',fetchuser,
async (req,res)=>{
    try{
        userId= req.user.id;
        //find the user with the user id 
        const user=await User.findById(userId).select("-password");
        res.send(user);
    }catch(err){
        res.status(500).send('Internal Server Error'+err)
    }
});

module.exports=router;