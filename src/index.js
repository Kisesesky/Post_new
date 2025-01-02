import mongoose from "mongoose"
import app from "./app.js"
import './config/passport.js'


mongoose.connect('mongodb://127.0.0.1:27017/mongoose-repeat')
    .then(()=>{
        console.log("db connected")
        app.listen(3001, ()=>{
            console.log("server running")
        })
    })