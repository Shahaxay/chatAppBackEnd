const fs=require('fs');
const util=require('util');

const Jwt=require('../service/jwt');
const Error=require('../service/error');
const Message=require('../model/message');
const Inbox=require('../model/inbox');
const sequelize = require('../service/db');
const AWS=require('../service/awsS3');

//converting fs.unlink fn which flow traditional callback into promise
const unlinkFile=util.promisify(fs.unlink);

const postSendMessage=async(req,res,next)=>{
    let groupId=req.params.groupId;
    //if no group
    const group_id_payload=Jwt.decrypt(groupId);
    groupId=group_id_payload.groupId;
    try{
        const message=await req.user.createMessage({message:req.body.message,name:req.user.name,groupId:groupId});
        res.status(201).json({status:"success"});
    }
    catch(err){
        Error.internalServerError(err,res);
    }
}

const getInboxMessages=async(req,res,next)=>{
    try{
        let inboxMessages=await Inbox.findAll({
            attributes:[[sequelize.literal('(SELECT name FROM Users WHERE useRs.id = inbox.userId)'), 'sender'],'message'],
            where:{receiver:req.user.id}});
            inboxMessages=inboxMessages.map(msg=>{
                return msg.dataValues;
            })
            // console.log(inboxMessages);

            res.status(201).json(inboxMessages);
        }
        catch(err){
            Error.internalServerError(err,res);
    }
    
}

const postSendMultimedia=async(req,res,next)=>{
    console.log(req.file);
    console.log(req.body);
    let {element,groupId}=req.body;
    const filename=req.file.originalname;

    groupId=Jwt.decrypt(groupId).groupId;
    console.log(req.user);

    try{
        const location=await AWS.uploadToS3(req.file);
        //delete file form server
        await unlinkFile(req.file.path);
        //need to save the link as chat with respect to particular group
        const msg=(element=='document')?filename:element;
        await req.user.createMessage({message:msg,name:req.user.name,multimedia:location,groupId:groupId});
        res.status(201).json({location:location,element:element,filename:filename});
    }
    catch(err){
        Error.internalServerError(err,res);
    }
}

module.exports={
    postSendMessage,
    getInboxMessages,
    postSendMultimedia
}