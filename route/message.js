const express=require('express');

const messageController=require('../controller/message');
const Authentication=require('../middleware/authenticate');

const route=express.Router();

route.use(Authentication.authenticate);

route.post('/send-message/:groupId',messageController.postSendMessage);

route.get('/get-messages/:groupId',messageController.getMessages);

route.get('/message/get-inbox-message',messageController.getInboxMessages);

module.exports=route;
