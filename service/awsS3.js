const aws=require('aws-sdk');
const s3=require('aws-sdk/clients/s3');
const fs=require('fs');
const dotenv=require('dotenv');

dotenv.config();

const uploadToS3=(file)=>{
    const s3bucket=new s3({
        accessKeyId:process.env.IAM_USER_ACCESS_KEY_ID,
        secretAccessKey:process.env.IAM_USER_SECRET_ACESS_KEY
    });
    //createReadStream as body
    const fileStream=fs.createReadStream(file.path);
    const extension=file.originalname.split('.').pop();
    const filename=`${file.filename}-${Date.now()}.${extension}`;
    
    var option={
        Bucket:process.env.BUCKET_NAME,
        Key:filename,
        Body:fileStream,
        ACL:'public-read',
        ContentType:file.mimetype
    }
    //upload task is asyn to make the responce wait wraping it with promise
    return new Promise((resolve,reject)=>{
        s3bucket.upload(option,(err,result)=>{
            if(err){
                console.log(err);
                reject(err);
            }else{
                console.log(result);
                resolve(result.Location);
            }
        })
    });
}

module.exports={
    uploadToS3
};