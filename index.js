const express=require("express")
const cors=require("cors")
const { Connection } = require("./Configuration/db")
const { UserRoute } = require("./Routes/user.js")
const { PostBookRoute } = require("./Routes/postBook")




require("dotenv").config()

const PORT= process.env.PORT || 8000

const app=express()

app.use(cors({
    origin:"*"
  }))
app.use(express.json());


app.get("/",(req,res)=>{
    res.send("Welcome To Buy-Car")
})


// User Route //
app.use("/user",UserRoute)
app.use("/sellbook",PostBookRoute)


app.listen(PORT, async()=>{
    try{
   await Connection
   console.log('Connected To Database')
   console.log(`server is running at http://localhost:${PORT}`)
    }
    catch(err){
        console.log(`Error while connecting to Database ${err}`)
    }
})