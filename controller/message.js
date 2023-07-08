const Message=require('../model/message');
const Inbox=require('../model/inbox');
const sequelize = require('../service/db');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();

const postSendMessage=async(req,res,next)=>{
    let groupId=req.params.groupId;
    //if no group
    const group_id_payload=jwt.verify(groupId,process.env.SECRET_KEY);
    groupId=group_id_payload.groupId;
    try{
        const message=await req.user.createMessage({message:req.body.message,name:req.user.name,groupId:groupId});
        res.status(201).json({status:"success"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Internal Server Error"});
    }
    
}
// const getAllMembersOfGroup=async(req,res)=>{
//     const members=await Message.findAll({
//         attributes:[[sequelize.fn('DISTINCT',sequelize.col('userId')),'members'],'name']
//     })
//     return members;
// }

const getMessages=async(req,res,next)=>{
    const last_message_id=+req.query.lastMessageId;
    const groupId=req.params.groupId;
    console.log(last_message_id);
    console.log(groupId);
    try{
        const messages=await Message.findAll({
            // offset:last_message_id
        });
        // const members=await getAllMembersOfGroup(req,res);
        // console.log(members);
        res.status(201).json(messages);
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal Server Error"});
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
        console.log(err);
        res.status(500).json({message:"Internal Server Error"});
    }
    
}





module.exports={
    postSendMessage,
    getMessages,
    getInboxMessages
}