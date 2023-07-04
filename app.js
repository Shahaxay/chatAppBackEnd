const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');

const userRoute=require('./route/user');
const db=require('./service/db');


const app=express();

app.use(cors());
app.use(bodyParser.json());

app.use('/user',userRoute);

db.sync()
.then(result=>{
    app.listen(3000,()=>console.log("listening to 3000..."));
})
.catch(err=>console.log(err));


