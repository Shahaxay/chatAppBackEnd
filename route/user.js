const express=require('express');

const userController=require('../controller/user');

const route=express.Router();

route.post('/signup',userController.postSignup);

route.post('/login',userController.postLogin);

module.exports=route;