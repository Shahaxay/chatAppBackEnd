const express=require('express');

const messageController=require('../controller/message');
const authentication=require('../middleware/authenticate');

const route=express.Router();

route.post('/send-message',authentication.authenticate,messageController.postSendMessage);

module.exports=route;
