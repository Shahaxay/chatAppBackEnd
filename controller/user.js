const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');

const User=require('../model/user');

dotenv.config();

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

const postLogin=async(req,res,next)=>{
    const {email,password}=req.body;
    try{
        const user=await User.findOne({where:{email:email}});
        if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(err){
                    return res.status(500).json({message:"server internal error"});
                }
                if(result){
                    const secret_key=process.env.SECRET_KEY;
                    const encrypted_userId=jwt.sign({userId:user.id},secret_key);
                    res.status(201).json({id:encrypted_userId,name:user.name});
                }else{
                    res.status(401).json({message:"User not authorized"});
                }
            })
        }else{
            res.status(404).json({message:"User not found"});
        }

    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"internal surver error"});
    }
}

module.exports={
    postSignup,
    postLogin
}