  import mongoose from 'mongoose'

  const notificationSchema = mongoose.Schema({
date:{
    type: Date,
    required: true,
    default: Date.now()
},
message:{
    type: String,
    required: true
}
  },{
      timestamps:true
  })
const Notification = mongoose.model("notification", notificationSchema)

export default Notification;




