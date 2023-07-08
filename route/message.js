const express=require('express');

const messageController=require('../controller/message');
const authentication=require('../middleware/authenticate');

const route=express.Router();

route.post('/send-message/:groupId',authentication.authenticate,messageController.postSendMessage);

route.get('/get-messages/:groupId',authentication.authenticate,messageController.getMessages);

route.get('/message/get-inbox-message',authentication.authenticate,messageController.getInboxMessages);

module.exports=route;
