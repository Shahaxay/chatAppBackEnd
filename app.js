const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');

const userRoute=require('./route/user');
const messageRoute=require('./route/message');
const db=require('./service/db');
const User=require('./model/user');
const Message=require('./model/message');


const app=express();

app.use(cors({
    origin:'http://127.0.0.1:5500'
}));
app.use(bodyParser.json());

app.use('/user',userRoute);
app.use(messageRoute);

User.hasMany(Message);
Message.belongsTo(User);

// db.sync({force:true})
db.sync()
.then(result=>{
    app.listen(3000,()=>console.log("listening to 3000..."));
})
.catch(err=>console.log(err));


