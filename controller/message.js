const Jwt=require('../service/jwt');
const Error=require('../service/error');
const Message=require('../model/message');
const Inbox=require('../model/inbox');
const sequelize = require('../service/db');

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

const getMessages=async(req,res,next)=>{
    const last_message_id=+req.query.lastMessageId;
    const groupId=req.params.groupId;
    console.log(last_message_id);
    console.log(groupId);
    try{
        const messages=await Message.findAll({
            // offset:last_message_id
        });
        res.status(201).json(messages);
    }catch(err){
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





module.exports={
    postSendMessage,
    getMessages,
    getInboxMessages
}