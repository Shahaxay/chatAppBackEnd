const express=require('express');
const multer=require('multer');

const messageController=require('../controller/message');
const Authentication=require('../middleware/authenticate');

const route=express.Router();

// //multer storage
// const storage=multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,'upload/');
//     },
//     filename:function(req,file,cb){
//         console.log(file);
//         cb(null,file.filename);
//     }
// });

route.use(Authentication.authenticate);

route.post('/send-message/:groupId',messageController.postSendMessage);

route.get('/get-inbox-message',messageController.getInboxMessages);

// route.post('/send-multimedia',multer({storage:storage}).single('sent_file'), messageController.postSendMultimedia)

route.post('/send-multimedia',multer({dest:'upload/'}).single('sent_file'), messageController.postSendMultimedia)

module.exports=route;
