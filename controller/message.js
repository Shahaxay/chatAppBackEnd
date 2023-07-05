const Message=require('../model/message');

const postSendMessage=async(req,res,next)=>{
    try{
        // const msg=await Message.findOne({where:{userId:req.user.id}});
        // if(msg){
        //     await Message.update({message:req.body.message},{where:{userId:req.user.id}});
        // }else{
        //     const message=await req.user.createMessage({message:req.body.message});
        // }
        const message=await req.user.createMessage({message:req.body.message,name:req.user.name});
        res.status(201).json({status:"success"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Internal Server Error"});
    }
    
}

const getMessages=async(req,res,next)=>{
    try{
        const messages=await Message.findAll();
        res.status(201).json(messages); //also need to sedn name
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal Server Error"});
    }
    
}

module.exports={
    postSendMessage,
    getMessages
}