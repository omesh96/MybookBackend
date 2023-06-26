const express=require("express")
const bcrypt=require("bcrypt")

const { UserModel } = require("../models/userModel.js")
require("dotenv").config()
const jwt=require("jsonwebtoken")

const UserRoute=express.Router()


// Register a user // 

 UserRoute.post("/signup",async(req,res)=>{
    const {name,email,password,mobile}=req.body
    //  res.setHeader("Access-Control-Allow-Origin", "https://jungle-green-hummingbird-wrap.cyclic.app/");
    //  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    //  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    
    try{
        // check for existing email //
        const existemail=new Promise(async(resolve,reject)=>{
   
          //  UserModel.findOne({email}, (email,err)=>{
                // if(err) reject(new Error(err))
                // if(email) reject({error:"This email id is already in use"})
                // resolve()
                let alreadyexistemail=await UserModel.findOne({email})
                if(alreadyexistemail){
                    reject({error:"This email id is already in use"})
                } else{
                    resolve()
                }
         //   })
        })
    
        const existmobile=new Promise(async(resolve,reject)=>{
            // UserModel.findOne({mobile},(mobile,err)=>{
            //     if(err) reject(new Error(err))
            //     if(mobile) reject({error:"This mobile is already in use"})
            //     resolve()
            // })
            let alreadyexistmobile=await UserModel.findOne({mobile})
            if(alreadyexistmobile){
                reject({error:"This mobile is already in use"})
            } else{
                resolve()
            }
        })
    
        Promise.all([existemail,existmobile])
        .then(()=>{
            if(password){
                bcrypt.hash(password,5,async(err,hash)=>{
               if(err){
                   return res.status(500).send({err})
               } else{
                   const user=new UserModel({name,email,password:hash,mobile})
                   await user.save()
                   res.status(201).send({msg:"User Register Successfully !"})
               }
                })
                  }
        })
        .catch((err)=>{
            console.log("wrong")
            return res.status(500).send({err:err})
        }
        )
    }
    catch(err){
        return res.status(501).send({error:err})
    }
  
 })


 // login user //
 UserRoute.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try{
         const user=await  UserModel.findOne({email})
   
            if(!user) return  res.status(404).send({err:"email Not Found..!"})
            if(user){
                bcrypt.compare(password,user.password,(err,result)=>{  // comapiring hashed password
                    if(result){
                    const {_id,name,email}=user
                    // create jwt token //
                    //   const token=jwt.sign({userId:user._id,name:user.name},process.env.SECRET_KEY,{expiresIn:"24h"})
                    const token=jwt.sign({userId:user._id},process.env.SECRET_KEY)
                    return res.status(200).send({msg:"Login Successfull...!",user:{_id,name,email},token:token})
                }   
                else{
                   return  res.status(404).send({err:"Password Did Not Match"})
                }
             })
            }
      
       }
       catch(err){ 
       return res.status(500).send({err})
       }
  
 })



module.exports={UserRoute}