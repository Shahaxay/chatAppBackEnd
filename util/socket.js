const {Server}=require('socket.io');
const {instrument}=require('@socket.io/admin-ui');

const Jwt=require('../service/jwt');

const socket=(server)=>{
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
}

module.exports={
    socket
}