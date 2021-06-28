import mongoose from 'mongoose'
import Paginate from 'mongoose-paginate-v2';


const customerSchema = mongoose.Schema({
    customerImage :{
        type: String,
   
    },
    name :{
        type: String,

    },
    email :{
        type: String,
    },
    tel :{
        type: String,
    },
    address :{
        type: String,
        required: true,
        default: "address in Siem reap"
    },
    uid:String,
    long :{
        type: Number,
    },
    lat:{type:Number},
    registerDate:{
        type: Date,
    },
    token: String

},{
    timestamps: true 

})

customerSchema.plugin(Paginate)

const Customer = mongoose.model('customer',customerSchema);
export default Customer;