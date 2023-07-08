const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');

const User=require('../model/user');
const Group=require('../model/group');

dotenv.config();

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
                    const secret_key=process.env.SECRET_KEY;
                    const encrypted_userId=jwt.sign({userId:user.id},secret_key);
                    res.status(201).json({id:encrypted_userId,name:user.name});
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

const getUsers=async(req,res,next)=>{
    try{
        let users=await User.findAll({
            attributes:['id','name'],
            limit:10
        })
        users=users.map(user=>{
            if(user.id==req.user.id){
                return;
            }
            user.dataValues.id=jwt.sign({userId:user.id},process.env.SECRET_KEY);
            return user;
        })
        res.status(201).json(users);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"internal surver error"});
    }
}

const postSendInvitation=async(req,res,next)=>{
    let {users,name,groupId}=req.body;
    try{
        // groupId=jwt.verify(groupId,process.env.SECRET_KEY).groupId;
        users.forEach(async user=>{
            let receiverId=jwt.verify(user,process.env.SECRET_KEY);
            await req.user.createInbox({
                message:`http://localhost:3000/user/join-group/${groupId}`, //no need of header jwt
                receiver:receiverId.userId
            })
            console.log("created");
        })
        res.status(201).json({status:"success"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"internal surver error"});
    }
    
    //save to db with sender and receiver name with link to join the group
}

const getJoinGroup=async (req,res,next)=>{
    let groupId=req.params.groupId;
    groupId=jwt.verify(groupId,process.env.SECRET_KEY).groupId;
    try{
        const group=await Group.findByPk(groupId);
        const result=await req.user.addGroup(group);
        let totalMember=group.totalMember+1;
        await Group.update({totalMember:totalMember},{where:{id:groupId}});
        console.log(result);
        res.status(201).json({message:"success"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"internal surver error"});
    }
}

module.exports={ 
    postSignup,
    postLogin,
    getUsers,
    postSendInvitation,
    getJoinGroup
}