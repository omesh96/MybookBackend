
const express=require("express")
const requireLogin=require("../Middleware/requireLogin.js")
const { BookModel } = require("../models/postBookModel.js")
const { userModel } = require("../models/userModel.js")


const PostBookRoute=express.Router()


 // Post a second-hand car with details //

 PostBookRoute.post("/addbook",requireLogin,async(req,res)=>{
   const {image,title,author,yearOfRelease,genre,price,rating,about}=req.body

       if(!image || !title || !author || !yearOfRelease ||
        !genre || !price || !rating || !about){
               return res.status(422).json({error:"Please Add All the fields...!"})
           }
           console.log("user3",req.user)

           const addCar=new BookModel({
               image,
               title,
               author,
               yearOfRelease,
               genre,
               about,
               rating,
               price,
              
               postedBy:req.user._id,
               name:req.user.name
           })

           addCar.save().then((result)=>{
               return res.status(200).json({post:result,msg:"Car Added Successfully...!"})
              })
              .catch(err=> console.log(err))
 })

 // Get the post of loged in user only  //
 PostBookRoute.get("/getpost/:id",async(req,res)=>{
   const id=req.params.id
   console.log("id",id)
  
     BookModel.find({postedBy:id})
    // .populate("postedBy", "_id") 
     .then((post,err)=>{
      
       if(err){
           return res.status(422).json({error:err})
       }
        res.status(200).json({post})
     })
    

   })
 

 // Get the post of loged in user for a selected company cars

 PostBookRoute.get("/getfilterbycompany/:id",async(req,res)=>{
   const id=req.params.id
   const {company}=req.query
   console.log(company)
   userModel.findById(id)
   .select("-password")   // password hatane k liye
   .then(user=>{
     BookModel.find({$and:[{postedBy:id},{car_Manufacturer:company}]})
    // .populate("postedBy", "_id") 
     .then((post,err)=>{
      
       if(err){
           return res.status(422).json({error:err})
       }
        res.status(200).json({user,post})
     })
     .catch(err=>{
       return res.status(422).json({error:"User Not Found"})
     })

   })
 
 })

  // Get the post of loged in user for a selected color of cars
 PostBookRoute.get("/getfilterbycolor/:id",async(req,res)=>{
   const id=req.params.id
   const {color}=req.query
  
   userModel.findById(id)
   .select("-password")   // password hatane k liye
   .then(user=>{
     BookModel.find({$and:[{postedBy:id},{Original_Paint:color}]})
    // .populate("postedBy", "_id") 
     .then((post,err)=>{
      
       if(err){
           return res.status(422).json({error:err})
       }
        res.status(200).json({user,post})
     })
     .catch(err=>{
       return res.status(422).json({error:"User Not Found"})
     })

   })
 
 })

  // Get the post of loged in user in a sorting order on based of price
  PostBookRoute.get("/getsortbyprice/:id",async(req,res)=>{
   const id=req.params.id
   const {price}=req.query
  console.log(price)
   
  if(price=="asc"){
   userModel.findById(id)
   .select("-password")   // password hatane k liye
   .then(user=>{
     BookModel.find({postedBy:id}).sort( { price : 1 } )
    // .populate("postedBy", "_id") 
     .then((post,err)=>{
      
       if(err){
           return res.status(422).json({error:err})
       }
        res.status(200).json({user,post})
     })
     .catch(err=>{
       return res.status(422).json({error:"User Not Found"})
     })

   })
  } else{
   userModel.findById(id)
   .select("-password")   // password hatane k liye
   .then(user=>{
       BookModel.find({postedBy:id}).sort( { price : -1 } )
    // .populate("postedBy", "_id") 
     .then((post,err)=>{
      
       if(err){
           return res.status(422).json({error:err})
       }
        res.status(200).json({user,post})
     })
     .catch(err=>{
       return res.status(422).json({error:"User Not Found"})
     })

   })
   .catch(err=>{
       return res.status(422).json({error:"User Not Found"})
     })
  }
 

  
 })

  // Get the post of loged in user in a sorting order on based of Rating
  PostBookRoute.get("/getsortbyrating/:id",async(req,res)=>{
    const id=req.params.id
    const {rating}=req.query
   console.log(rating)
    
   if(rating=="asc"){
   
      BookModel.find({postedBy:id}).sort( { rating : 1 } )
     // .populate("postedBy", "_id") 
      .then((post,err)=>{
       
        if(err){
            return res.status(422).json({error:err})
        }
         res.status(200).json({post})
      })
     
 
    
   } else{
    
        BookModel.find({postedBy:id}).sort( { rating : -1 } )
     // .populate("postedBy", "_id") 
      .then((post,err)=>{
       
        if(err){
            return res.status(422).json({error:err})
        }
         res.status(200).json({post})
      })
     
 
    
  
   }
  
 
   
  })

 // Update data by dealers  //
 PostBookRoute.patch("/updatedata/:id",async(req,res)=>{
   const id = req.params.id
   const payload=req.body
   console.log(req.body)
   try{
       const data = await BookModel.findByIdAndUpdate({_id: id},payload);
       res.send({message : "Product Details Updated!", oldProductDetais : data})
   }
   catch(err)
   {
       res.send({message : "Something went Wrong!", error : err.message});
   }
 })

  // Delete Post //
PostBookRoute.delete("/deletepost/:postId",requireLogin,async(req,res)=>{
   const id=req.params.postId
   console.log(id)
  await BookModel.findById(id)
 //  .populate("postedBy", "_id")
   .then((post,err)=>{
       if(err || !post){
           return res.status(422).json({error:err})
       }
    //  console.log(post.postedBy.toString(), req.user._id.toString())
       if(post.postedBy.toString()==req.user._id.toString()){
        // post.remove()
        BookModel.findByIdAndDelete(id)
         .then(result=> {
           return res.json({msg:"Successfully DELETED"})
         }).catch((err)=> {
          console.log(err)
         })
       } else{
           return res.status(422).json({msg:"You are not Authorised to delete This Post"})
       }
   })
   .catch((err) => {
       console.log(err)
     });
})

// get all the post posted by all the dealers/users //
 
PostBookRoute.get("/getdata",async(req,res)=>{
   try {
       let data = await BookModel.find();
       res.status(200).send(data);
    } catch (error) {
       res.send(error.message);
    }
})




  // Get all the post  in a soted manner for price of book

 PostBookRoute.get("/getalldatasortedbyprice/",async(req,res)=>{
  
  
   const {price}=req.query
  console.log(price)
   
  if(price=="asc"){
   BookModel.find().sort( { price : 1 } )
   // .populate("postedBy", "_id") 
    .then((post,err)=>{
     
      if(err){
          return res.status(422).json({error:err})
      }
       res.status(200).json({post})
    })
    .catch(err=>{
      return res.status(422).json({error:"User Not Found"})
    })
  } else{
   BookModel.find().sort( { price : -1 } )
    // .populate("postedBy", "_id") 
     .then((post,err)=>{
      
       if(err){
           return res.status(422).json({error:err})
       }
        res.status(200).json({post})
     })
     .catch(err=>{
       return res.status(422).json({error:"User Not Found"})
     })
  
  }
 
 
 })

 // get all the data sorted by rating  //

 PostBookRoute.get("/getalldatasortedbyrating/",async(req,res)=>{
  
  
  const {rating}=req.query
 console.log(rating)
  
 if(rating=="asc"){
  BookModel.find().sort( { rating : 1 } )
  // .populate("postedBy", "_id") 
   .then((post,err)=>{
    
     if(err){
         return res.status(422).json({error:err})
     }
      res.status(200).json({post})
   })
   .catch(err=>{
     return res.status(422).json({error:"User Not Found"})
   })
 } else{
  BookModel.find().sort( { rating : -1 } )
   // .populate("postedBy", "_id") 
    .then((post,err)=>{
     
      if(err){
          return res.status(422).json({error:err})
      }
       res.status(200).json({post})
    })
    .catch(err=>{
      return res.status(422).json({error:"User Not Found"})
    })
 
 }


})

 

 module.exports={PostBookRoute}