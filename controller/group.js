const Group = require('../model/group');
const GroupUser = require('../model/groupUser');
const Jwt = require('../service/jwt');
const Error = require('../service/error');

const postCreateGroup = async (req, res, next) => {
    const { name } = req.body;
    console.log(name);
    try {
        const group = await req.user.createGroup({ name: name, totalMember: 1 }, { through: { isAdmin: true } });
        //encrypt group id
        const id = Jwt.encrypt({ groupId: group.id });
        // req.user.addGroup(group);
        res.status(201).json({ id: id, name: group.name });
    }
    catch (err) {
        Error.internalServerError(err,res);
    }
}

const getGroups = async (req, res, next) => {
    try {
        let groups = await req.user.getGroups({
            attributes: ['id', 'name']
        });
        groups = groups.map(group => {
            const { id, groupUser, ...modifiedGroup } = group.dataValues;
            modifiedGroup.id = Jwt.encrypt({ groupId: group.id });
            // console.log(modifiedGroup);
            return modifiedGroup;
        });
        res.status(201).json(groups);
    }
    catch (err) {
        Error.internalServerError(err,res);
    }
}

const getGroupMessage = async (req, res, next) => {
    try {
        let last_index=Number(req.query.last);
        let groupId = req.params.groupId;
        const dcrypt = Jwt.decrypt(groupId).groupId;
        let group = await Group.findByPk(dcrypt);
        const messages = await group.getMessages({ 
            attributes: ['id','name', 'message','multimedia'],
            offset:last_index,
            // limit:5
        });
        //checking for admin
        const user = await GroupUser.findOne({
            attributes: ['isAdmin'],
            where: { userId: req.user.id, groupId: dcrypt }
        });
        // console.log(messages); 
        res.status(201).json({messages,isAdmin:user.isAdmin});
        //fetch group chat
    }
    catch (err) {
        Error.internalServerError(err,res);
    }
}

const getGroupMembers = async (req, res, next) => {
    let groupId = req.params.groupId;
    groupId = Jwt.decrypt(groupId).groupId;
    try {
        const group = await Group.findByPk(groupId);
        let groupUsers = await group.getUsers({
            attributes: ['name', 'id']
        });
        groupUsers = groupUsers.map(user => {
            const { groupUser } = user;
            user.dataValues.isAdmin = groupUser.isAdmin;
            user.dataValues.id = Jwt.encrypt({ userId: user.id });
            delete user.dataValues.groupUser;
            return user.dataValues;
        })
        console.log(groupUsers);
        res.status(201).json({ groupUsers, groupName: group.name, totalMembers: group.totalMember });
    }
    catch (err) {
        Error.internalServerError(err,res);
    }
}

const postMakeAdmin = async (req, res, next) => {
    let { groupId, userId } = req.body;
    console.log(groupId, userId);
    groupId = Jwt.decrypt(groupId).groupId;
    userId = Jwt.decrypt(userId).userId;
    // console.log(groupId,userId);
    try {
        const result = await GroupUser.update({ isAdmin: true }, {
            where: {
                groupId: groupId,
                userId: userId
            }
        });
        res.status(201).json({ success: true });
    }
    catch (err) {
        Error.internalServerError(err,res);
    }
}

const postRemoveMember = async (req, res, next) => {
    let { groupId, userId } = req.body;
    groupId = Jwt.decrypt(groupId).groupId;
    userId = Jwt.decrypt(userId).userId;
    try {
        const result = await GroupUser.findOne({ where: { userId: userId, groupId: groupId } });
        result.destroy();
        const group = await Group.findByPk(groupId);
        console.log(group.totalMember);
        Group.update({ totalMember: group.totalMember - 1 }, { where: { id: group.id } });
        res.status(201).json({ success: true });
    }
    catch (err) {
        Error.internalServerError(err,res);
    }

}

module.exports = {
    postCreateGroup,
    getGroups,
    getGroupMessage,
    getGroupMembers,
    postMakeAdmin,
    postRemoveMember
}