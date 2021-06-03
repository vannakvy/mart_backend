import mongoose from 'mongoose';
import Paginate from 'mongoose-paginate-v2';
const purchaseSchema = mongoose.Schema({

        supplier:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'supplier'
        },
        product:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,  
            ref:"product" ,
            populate:true
            
        },
    price:{
        type: Number,
        required: true,
        default: 0
    },
    qty:{
        type: Number,
        required: true,
        default: 0
    }

},{
    timestamps:true
})

purchaseSchema.plugin(Paginate)
const Purchase = mongoose.model("purchase",purchaseSchema)
export default Purchase;