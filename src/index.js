// require('dotenv').config({path: './env'})
import dotenv from 'dotenv'
//no express is use till now
import connectDB from './db/index.js'

import {app} from "./app.js"

dotenv.config({
    path:'./env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port :${process.env.PORT}`);
    })
    app.on("error",()=>{
        console.log(`ERRR:`, error);
        throw error
    })
})
.catch((error)=>{
    console.log(`MONGO db connection  failed!!!!${error}`);
})



//   app.listen(process.env.PORT, () => {
//     console.log(`Example app listening on port ${process.env.PORT}`)
//   })



/*import express from 'express'
const app = express()
//try catch madhe wrapkaracha
// DB IS ALWAYS IN ANOTHER CONTINENT //async await

;(async()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error",()=>{
            console.log(`ERRR:`, error);
            throw error
        })
        app.listen(process.env.PORT, () => {
            console.log(`Example app listening on port ${process.env.PORT}`)
          })
    } catch(error){
        console.log(`MongoDB connection failed :${error}`)
        throw err;
    }
})();

*/

