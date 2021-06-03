  import mongoose from 'mongoose'

  const notificationSchema = mongoose.Schema({
eventType:String,
message:{
    type: String,
    required: true
},
allClient:{type:Boolean, required:true,default:false},
user:{
  type: mongoose.Schema.Types.ObjectID,
  required: false, 
  ref:'users'
}
  },{
      timestamps:true
  })
const Notification = mongoose.model("notification", notificationSchema)

export default Notification;




