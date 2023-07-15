const Sequelize=require('sequelize');
const sequelize=require('../service/db');

const message=sequelize.define('message',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    message:{
        type:Sequelize.STRING,
        allowNull:false
    },
    multimedia:{
        type:Sequelize.STRING
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports=message;