const Sequelize=require('sequelize');
const sequelize=require('../service/db');

const user=sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    phone:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports=user;