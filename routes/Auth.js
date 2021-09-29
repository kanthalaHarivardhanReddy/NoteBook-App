const express=require('express');
const router=express.Router();
const User=require('../models/User');
const {body, validationResult}=require('express-validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const fetchuser=require('../middleware/fetchuser');

const JWT_KEY="HEISAGOOD$BOYFORNOW";
router.post('/createuser',[
    body('name','Enter a Valid Name').isLength({min:3}),
    body('email','Enter a Valid Email').isEmail(),
    body('password','Password must be atleast 5 characters').isLength({min:5})
],async (req,res)=>{
    try{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        //finding if a user already exists
        let user=await User.findOne({email:req.body.email});
        //creating a user 
        if(user){
            return res.status(400).send('Enter a valid credentials');
        }
        const salt=await bcrypt.genSalt(10);
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
        const authtoken=jwt.sign(data,JWT_KEY);
        res.send({authtoken});
    }catch(err){
        res.status(500).send('Internal Server Error')
    }
});

router.post('/login',[
    body('email','Enter a Valid Email').isEmail(),
    body('password','Password must be atleast 5 characters').isLength({min:5})
],async (req,res)=>{
    try{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        //finding if a user already exists
        const {email,password}=req.body;
        let user=await User.findOne({email:email});
        console.log(user);

        if(user===null){
            return res.status(400).send('User not yet registered! please register first');
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
            res.send({authtoken});
        }
        else{
            console.log("login failed");
            return res.status(400).send('Enter a valid credentials');
        }
        
    }catch(err){
        res.status(500).send('Internal Server Error'+err.msg)
    }   
});

router.post('/getuser',fetchuser,
async (req,res)=>{
    try{
        const userId=await req.user.id;
        const user=await user.findById(userId).select("-password");
        res.send(user);
    }catch(err){
        res.status(500).send('Internal Server Error'+err)
    }
});

module.exports=router;