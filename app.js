const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const fs=require('fs');
const path=require('path');
const http=require('http');
const morgan=require('morgan');

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
const Socket=require('./util/socket');
// const Authentication=require('./middleware/authenticate');


const app=express();


app.use(cors({
    origin:'http://127.0.0.1:5500'
}));

app.use(bodyParser.json());

const fileStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});
app.use(morgan('combined',{stream:fileStream}));

const server=http.createServer(app);

//socket.io
Socket.socket(server);

express.static(path.join(__dirname,'public'));

app.use('/user',userRoute);
app.use('/message',messageRoute);
app.use('/group',groupRoute);
app.use('/admin',adminRoute);

//*not preventing chat.index from rendering*
// app.use('/chat/chat.index',Authentication.authenticate);

app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,`public/${req.url}`));
})

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


// db.sync({force:true})
db.sync()
.then(result=>{
    server.listen(3000,()=>console.log("listening to 3000..."));
})
.catch(err=>console.log(err));


