import mongoose from 'mongoose'
import dotenv from 'dotenv'
import {error, success} from 'consola'
import {DB} from './index.js'

dotenv.config()

const connectDB =  ()=>{
    try{
        const conn =  mongoose.connect(DB,{useUnifiedTopology:false,useNewUrlParser: true,useCreateIndex: true })
        success({
            badge: true,
            message: `Successfully connected with the database ${conn}`,
          });
    }catch(err){
        error({
            badge: true,
            message: err.message,
          });
    }
}

export default connectDB;


