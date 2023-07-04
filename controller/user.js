const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

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
                    const secret_key="this is a secret key";
                    jwt.sign({id:user.id},secret_key,(err,encrypted_result)=>{
                        if(err){
                            console.log(err);
                            return res.status(501).json({message:"server internal error"});
                        }
                        res.status(201).json({id:encrypted_result})
                    })
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