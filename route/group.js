const express=require('express');

const groupController=require('../controller/group');
const Authentication=require('../middleware/authenticate');

const route=express.Router();

route.use(Authentication.authenticate);

route.get('/get-group-members/:groupId',groupController.getGroupMembers);

route.post('/make-admin',groupController.postMakeAdmin);

route.post('/remove-member',groupController.postRemoveMember);

module.exports=route;
