let jwt=require('jsonwebtoken');
const JWT_KEY='HEISAGOOD$BOYFORNOW';

const fetchuser=(req,res,next)=>{
    const token=req.header('auth-token');
    if(!token)
        res.status(401).send({error:"please Authenticate the user token"});
    try{
        const data=jwt.verify(token,JWT_KEY);
        console.log(data.user);
        req.user=data.user;
        next();
    }catch(error){
        res.status(401).send({error:"please Authenticate the user token"});
    }
}

module.exports=fetchuser;