const {Server}=require('socket.io');
const {instrument}=require('@socket.io/admin-ui');
const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const path=require('path');
const http=require('http');

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
const Jwt=require('./service/jwt');
const Authentication=require('./middleware/authenticate');


const app=express();


app.use(cors({
    origin:'http://127.0.0.1:5500'
}));
app.use(bodyParser.json());

const server=http.createServer(app);

//socket.io
const io=new Server(server,{
    cors:{
        origin:['https://admin.socket.io'],
        credentials:true
    }
})
//working with socket.io
io.on('connection',socket=>{
    console.log("connected");
    
    // socket.emit('test','this is test message');
    socket.on('disconnect',()=>{
        console.log('A user disconnected');
    })

    socket.on('new-member',name=>{
        socket.name=name;
    })

    socket.on('connect-group',groupId=>{
        groupId=Jwt.decrypt(groupId).groupId;
        socket.leaveAll();
        if(socket.groupId){
            socket.to(socket.groupId).emit('user-disconnected',socket.name);
        }
        socket.join(socket.id);
        socket.groupId=groupId;
        // console.log(socket.groupId);
        socket.join(socket.groupId);
        // console.log(socket.rooms.size)
        // console.log(`${socket.name} joined ${socket.groupId}`);
        socket.to(groupId).emit('user-connected',socket.name);
    });

    socket.on('send-group-message',(message)=>{
        // console.log(socket.groupId,socket.id);
        socket.broadcast.to(socket.groupId).emit('received-message',{name:socket.name,message:message});
    })

    socket.on('send-multimedia',(element,location,filename,cb)=>{
        socket.to(socket.groupId).emit('redeived-multimedia',{element,location,filename});
        cb("message sent");
    })
    
})  

//socket.io admin ui
instrument(io,{auth:false}); 


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


