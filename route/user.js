const express=require('express');

const userController=require('../controller/user');

const route=express.Router();

route.post('/signup',userController.postSignup);

module.exports=route;