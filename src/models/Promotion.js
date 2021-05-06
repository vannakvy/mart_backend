import mongoose from 'mongoose'
import Paginate from 'mongoose-paginate-v2';
const promotionSchema = mongoose.Schema({
    promotionType:{
        type:String,
        required: true
    },
    staffName:{
type:mongoose.Schema.Types.ObjectId,
required: true,
ref: 'User'
    },
    date:{
        type: Date,
        required: true
    },
    startDate:{
        type: Date,
        required: true
    },
    endDate:{
        type: Date,
        required: true
    },
product:[{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'Product'
}]
},{
    timestamps: true,
})
promotionSchema.plugin(Paginate)
const Promotion = mongoose.model( "promotion",promotionSchema)
export default Promotion;