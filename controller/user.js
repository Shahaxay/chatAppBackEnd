const bcrypt=require('bcrypt');

const User=require('../model/user');

const postSignup=async (req,res,next)=>{
    const {name,email,password,phone} =req.body;
    const user=await User.findOne({where:{email:email}});
    if(user){
        return res.status(409).json({message:"user already exist"});
    }
    let salt=10;
    const hash=bcrypt.hash(password,10,async (err,hash)=>{
        if(err){
            console.log(err);
            return res.status(500).json({message:"server internatl problem"});
        }
        try{
            const result=await User.create({name,email,phone,password:hash});
            res.status(201).json({id:result.id});
        }
        catch(err){
            console.log(err);
            res.status(501).json({message:"server internal problem"});
        }
    });
}

module.exports={
    postSignup
}