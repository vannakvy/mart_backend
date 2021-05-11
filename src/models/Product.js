import mongoose from 'mongoose'
import Paginate from 'mongoose-paginate-v2';


const reviewSchema = mongoose.Schema({
    name:{type: String, required: true},
    rating:{type:Number, required: true},
    comment:{type:String, required: true},
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
})
const productSchema = mongoose.Schema({
    productName:{
        type: String,
        required:true,
    },
    countInStock:{
        type: Number,required:true,default:0
    },
    rating:{
        type: Number,
        required: true,
        default: 0
    },
    numOfReview:{
        type: Number,
        required: true,
        default: 0
    },
    productImage:{
        type: String,
    },
    category:{
        type:String,
        enum: ["Fresh Food","Drink","Food"],
        required: true
    },
    description:{
        type:String
    },
    review:[reviewSchema]
})

productSchema.plugin(Paginate);

const Product = mongoose.model("product",productSchema)

export default Product