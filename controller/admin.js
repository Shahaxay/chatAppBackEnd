const Group=require('../model/group');
const User=require('../model/user');
const GroupUser=require('../model/groupUser');
const Jwt=require('../service/jwt');
const Error=require('../service/error');

const postAddMember=async (req,res,next)=>{
    let {groupId,userId}=req.body;
    groupId=Jwt.decrypt(groupId).groupId;
    userId=Jwt.decrypt(userId).userId;
    try{
        const group=await Group.findByPk(groupId);
        const user=await User.findByPk(userId);
        await group.addUser(user,{through:{isAdmin:false}});
        Group.update({totalMember:group.totalMember+1},{where:{id:groupId}});
        res.status(201).json({success:true});
    }
    catch(err){
        Error.internalServerError(err,res);
    }
}

module.exports={
    postAddMember
}