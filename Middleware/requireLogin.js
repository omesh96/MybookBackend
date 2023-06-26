 
 const jwt=require("jsonwebtoken")

 const mongoose=require("mongoose");
const { UserModel } = require("../models/userModel");
 require("dotenv").config()

 


 module.exports=(req,res,next)=>{
   const {authorization}=req.headers;
   if(!authorization){
    return res.status(422).json({error:"You must have looged in 1"})
   }
   const token=authorization.replace("Bearer ","") // Bearer aur space ko replace kreaga aur token ko variable me store kr lega
   jwt.verify(token,process.env.SECRET_KEY,(err,payload)=>{
    if(err){
        return res.status(401).json({error:"You must have looged in 2"})
    }
    console.log("payload",payload)
    const { userId }=payload
    UserModel.findById({_id:userId}).then((userData)=>{
       console.log("null",userData);
        if(userData){
            console.log("userData",userData)  // it will give all the register details of loged in user
            req.user=userData
            next()
        }
    })
    // let user=UserModel.findById(_id)
    // if(user){
    //     console.log("userData",user)
    //     next()
    // }
   })
 }