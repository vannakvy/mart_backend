import mongoose from 'mongoose'
import Paginate from 'mongoose-paginate-v2';
const OfferSchema = mongoose.Schema({
    title: String ,
    start_date : Date,
    end_date:Date,
    discount: Float,
    product:{ type: mongoose.Schema.Types.ObjectId,
ref:'products',
},
description:String
})


OfferSchema.plugin(Paginate)


const Offer = mongoose.model('Offer',OfferSchema)

export const Offer;