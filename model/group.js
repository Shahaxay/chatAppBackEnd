const Sequelize=require('sequelize');
const sequelize = require('../service/db');

const group=sequelize.define("group",{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true 
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    totalMember:{
        type:Sequelize.INTEGER,
        allowNull:false
    }
});

module.exports=group;