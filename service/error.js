const internalServerError=(err,res)=>{
    console.log(err);
    res.status(500).json({message:"Internal Server Error"});
}

module.exports={
    internalServerError
}