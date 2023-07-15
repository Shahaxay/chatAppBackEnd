const bcrypt=require('bcrypt');

const User=require('../model/user');
const Group=require('../model/group');
const GroupUser=require('../model/groupUser');
const Jwt=require('../service/jwt');
const Error=require('../service/error');

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
            Error.internalServerError(err,res);
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
                    const encrypted_userId=Jwt.encrypt({userId:user.id});
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
            user.dataValues.id=Jwt.encrypt({userId:user.id});
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
        users.forEach(async user=>{
            let receiverId=Jwt.decrypt(user);
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
    groupId=Jwt.decrypt(groupId).groupId;
    try{
        const isAlreadyMember=await GroupUser.findOne({where:{groupId:groupId,userId:req.user.id}});
        if(isAlreadyMember){
            return res.status(409).json({message:"already in group"})
        }
        const group=await Group.findByPk(groupId);
        const result=await req.user.addGroup(group,{through:{isAdmin:false}});
        // console.log(result);
        let totalMember=group.totalMember+1;
        // console.log(totalMember);
        await Group.update({totalMember:totalMember},{where:{id:groupId}});
        res.status(201).json({message:"success"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"internal surver error"});
    }
}

const postSearchUser=async(req,res,next)=>{
    let {toSearch,column,groupId}=req.body;
    try{
        //Member?
        groupId=Jwt.decrypt(groupId).groupId;

        let users=await User.findAll({
            attributes:['id','name'],
            where:{[column]:toSearch}});

            users=await Promise.all(users.map(async user=>{

            const result=await GroupUser.findOne({where:{groupId:groupId,userId:user.id}});
            user.dataValues.isMember=(result)?true:false;
            user.dataValues.id=Jwt.encrypt({userId:user.id});
            return user.dataValues;
        }));
        console.log(users);
        res.status(201).json(users);
    }
    catch(err){
        Error.internalServerError(err,res);
    }
}

module.exports={ 
    postSignup,
    postLogin,
    getUsers,
    postSendInvitation,
    getJoinGroup,
    // postIsAdmin,
    postSearchUser
}