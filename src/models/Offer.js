import mongoose from "mongoose";
import Paginate from "mongoose-paginate-v2";
const OfferSchema = mongoose.Schema({
  title: String,
  start_date: Date,
  end_date: Date,
  discount: Number,
  isAllProduct: {
    type: Boolean,
    default: false,
  },
  product: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: "product",
     required: false
  },
  description: String,
},{timestamps:true});

OfferSchema.plugin(Paginate);

const Offer = mongoose.model("Offer", OfferSchema);

export default Offer;
