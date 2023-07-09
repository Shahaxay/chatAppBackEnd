const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');

const userRoute=require('./route/user');
const messageRoute=require('./route/message');
const groupRoute=require('./route/group');
const adminRoute=require('./route/admin');
const db=require('./service/db');
const User=require('./model/user');
const Message=require('./model/message');
const Group=require('./model/group');
const GroupUser=require('./model/groupUser');
const Inbox=require('./model/inbox');


const app=express();

app.use(cors({
    origin:'http://127.0.0.1:5500'
}));
app.use(bodyParser.json());

app.use('/user',userRoute);
app.use(messageRoute);
app.use('/group',groupRoute);
app.use('/admin',adminRoute);

//user message association
User.hasMany(Message);
Message.belongsTo(User);

//group message association
Group.hasMany(Message);
Message.belongsTo(Group);

//group user association
Group.belongsToMany(User,{through:GroupUser});
User.belongsToMany(Group,{through:GroupUser});

//sender(user) and inbox association
User.hasMany(Inbox);
Inbox.belongsTo(User);

//group message association
// async function f(){
//     const u=await User.findOne({where:{email:'shahaxay34@gmail.com'}})
//     // await u.createGroup({name:'g2',totalMember:10,message:'msg',name:'n'});
//     await u.createGroup({name:'g2',totalMember:10});
//     console.log("done");
// }



// db.sync({force:true})
db.sync()
.then(result=>{
    app.listen(3000,()=>console.log("listening to 3000..."));
})
.catch(err=>console.log(err));


