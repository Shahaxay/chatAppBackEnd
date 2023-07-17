const Sequelize=require('sequelize');
const sequelize=require('../service/db');

const archieveMessage=sequelize.define('archieveMessage',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    message:Sequelize.STRING,
    multimedia:Sequelize.STRING,
    name:Sequelize.STRING,
    userId:Sequelize.INTEGER,
    groupId:Sequelize.INTEGER
});

module.exports=archieveMessage;