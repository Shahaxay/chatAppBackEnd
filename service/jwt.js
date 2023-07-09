const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');

dotenv.config();

const encrypt=(payload)=>{
    return jwt.sign(payload,process.env.SECRET_KEY);
}

const decrypt=(encryptedPayload)=>{
    return jwt.verify(encryptedPayload,process.env.SECRET_KEY);
}

module.exports={
    encrypt,
    decrypt
}