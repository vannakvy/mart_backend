import mongoose from 'mongoose'
import Paginate from 'mongoose-paginate-v2';
const customerSchema = mongoose.Schema({
    customerImage :{
        type: String,
        required: true,
        default: "default.jpg"
    },
    name :{
        type: String,
        required: true,
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
        default: "default.jpg"
    },
    long :{
        type: Number,
    },
    lat:{type:Number},
    registerDate:{
        type: Date,
      
    }
},{
    timestamps: true 

})

customerSchema.plugin(Paginate)

const Customer = mongoose.model('customer',customerSchema);
export default Customer;