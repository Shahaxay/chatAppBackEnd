const express=require('express');

const Authentication=require('../middleware/authenticate');

const userController=require('../controller/user');
const groupController=require('../controller/group');

const route=express.Router();

route.post('/signup',userController.postSignup);

route.post('/login',userController.postLogin);

route.post('/create-group',Authentication.authenticate,groupController.postCreateGroup);

route.get('/get-groups',Authentication.authenticate,groupController.getGroups);

route.get('/group/:groupId',Authentication.authenticate,groupController.getGroupMessage);

route.get('/get-users',Authentication.authenticate,userController.getUsers);

route.post('/send-invitation',Authentication.authenticate,userController.postSendInvitation);

route.get('/join-group/:groupId',Authentication.authenticate,userController.getJoinGroup);


module.exports=route;