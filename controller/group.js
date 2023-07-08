const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();

const Group=require('../model/group');
const group = require('../model/group');
const postCreateGroup=async (req,res,next)=>{
    const {name}=req.body;
    console.log(name);
    try{
        const group=await req.user.createGroup({name:name,totalMember:1});
        //encrypt group id
        const id=jwt.sign({groupId:group.id},process.env.SECRET_KEY);
        // req.user.addGroup(group);
        res.status(201).json({id:id,name:group.name});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Server Internal Error"});
    }
}

const getGroups=async (req,res,next)=>{
    try{
        let groups=await req.user.getGroups({
            attributes:['id','name']
        });
        groups = groups.map(group => {
            const {id,groupUser, ...modifiedGroup}=group.dataValues;
            modifiedGroup.id= jwt.sign({ groupId: group.id }, process.env.SECRET_KEY);
            // console.log(modifiedGroup);
            return modifiedGroup;
          });
        res.status(201).json(groups);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Server Internal Error"});
    }
}

const getGroupMessage=async (req,res,next)=>{
    try{
        let groupId=req.params.groupId;
        const dcrypt=jwt.verify(groupId,process.env.SECRET_KEY);
        console.log(dcrypt.groupId);
        let group=await Group.findByPk(dcrypt.groupId);
        const messages=await group.getMessages({attributes:['id','name','message']});
        console.log(messages);
        res.status(201).json(messages);
        //fetch group chat
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Server Internal Error"});
    }
}

module.exports={
    postCreateGroup,
    getGroups,
    getGroupMessage
}