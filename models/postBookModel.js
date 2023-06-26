const mongoose=require("mongoose")

const CarSchema=mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    yearOfRelease:{
        type:Number,
        required:true
    },
   genre:
    {
    type:String
    }
,
    price:{
        type:Number,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    about:{
        type:String,
        required:true
    },
    postedBy:{
        type:String,
        required:true
    }
})

const BookModel=mongoose.model("myBook",CarSchema)

 // myBook is the name of table/schema 

module.exports={BookModel}