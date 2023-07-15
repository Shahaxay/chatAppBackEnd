const express=require('express');

const Authentication=require('../middleware/authenticate');

const userController=require('../controller/user');
const groupController=require('../controller/group');

const route=express.Router();

route.post('/signup',userController.postSignup);

route.post('/login',userController.postLogin);

route.use(Authentication.authenticate);

route.post('/create-group',groupController.postCreateGroup);

route.get('/get-groups',groupController.getGroups);

route.get('/group/:groupId',groupController.getGroupMessage);

route.get('/get-users',userController.getUsers);

route.post('/send-invitation',userController.postSendInvitation);

route.get('/join-group/:groupId',userController.getJoinGroup);

route.post('/search-user',userController.postSearchUser);






module.exports=route;