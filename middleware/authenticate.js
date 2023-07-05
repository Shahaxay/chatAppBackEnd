const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');

const User=require('../model/user');

dotenv.config();

exports.authenticate=async(req,res,next)=>{
    const token=req.headers.token;
    const secret_key=process.env.SECRET_KEY;
    const decrypt_payload=jwt.verify(token,secret_key);
    try{
        const user=await User.findByPk(decrypt_payload.userId);
        req.user=user;
    }
    catch(err){
        console.log(err);
        res.status(404).json({message:"not a valid user"});
    }
    next();
}