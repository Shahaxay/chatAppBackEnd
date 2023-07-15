const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');

const User=require('../model/user');

dotenv.config();

exports.authenticate=async(req,res,next)=>{
    try{
        const token=req.headers.token;
        const secret_key=process.env.SECRET_KEY;
        const decrypt_payload=jwt.verify(token,secret_key);
        const user=await User.findByPk(decrypt_payload.userId);
        req.user=user;
        next();
    }
    catch(err){
        console.log(err);
        //this should prevent from anyone to access the file
        return res.status(404).json({message:"not a valid user"}); 
    }
}