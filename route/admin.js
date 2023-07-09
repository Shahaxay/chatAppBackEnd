const express=require('express');

const adminController=require('../controller/admin');
const Authentication=require('../middleware/authenticate');

const route=express.Router();

route.use(Authentication.authenticate);

route.post('/add-member',adminController.postAddMember);


module.exports=route;