import mongoose from 'mongoose';
import Paginate from 'mongoose-paginate-v2';
const purchaseSchema = mongoose.Schema({
    date:{
        type:Date,
        required: true,
        product:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        product:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,  
            ref:"Supplier" 
    },
    price:{
        type: Number,
        required: true,
        default: 0
    }
}
},{
    timestamps:true
})

purchaseSchema.plugin(Paginate)
const Purchase = mongoose.model("purchase",purchaseSchema)
export default Purchase;