import {Schema,model} from "mongoose";
import Paginate from 'mongoose-paginate-v2';
const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId,required: true,ref: "User"},
    orderItems: [{type: Schema.Types.ObjectId,required: String,ref: "Product"},
    ],
    paymentMethod: {type: String,required: true},
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice:{type:Number,required: true,default:0},
    orderConfirmed: {type:Boolean, required:true, default:false},
    orderConfirmedDate: {type:Date, required:true},
    paid: {type:Boolean, required:true, default:false},
    paidDate: {type:Date, required:true},
    delivered: {type:Boolean, required:true, default:false},
    deliveredDate: {type:Date, required:true}
  },
  {
    timestamps: true,
  }
);
orderSchema.plugin(Paginate)


const Order = model("order",orderSchema)

export default Order;