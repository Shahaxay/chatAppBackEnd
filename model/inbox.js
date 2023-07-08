const Sequelize=require('sequelize');
const sequelize=require('../service/db');

const Inbox=sequelize.define('inbox',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    message:{
        type:Sequelize.STRING,
        allowNull:false
    },
    receiver:{
        type:Sequelize.STRING,
        allowNull:false
    }
    //userId of association acts as sender
});

module.exports=Inbox;