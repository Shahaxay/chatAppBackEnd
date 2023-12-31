const Sequelize=require('sequelize');
const sequelize = require('../service/db');

const groupUser=sequelize.define("groupUser",{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true 
    },
    isAdmin:{
        type:Sequelize.BOOLEAN,
        default:false,
        allowNull:false
    }
});

module.exports=groupUser;