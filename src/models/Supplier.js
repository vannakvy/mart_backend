import {model,Schema} from 'mongoose';
import Paginate from 'mongoose-paginate-v2';

const supplierSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
 
    tel: String,
    houseNumber: String,
    village:{
        type:String,
        required:true
    },
    commune:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    province:{
        type:String,
        required:true
    },
    imgUrl: String 
}, {
    timestamps: true
});

supplierSchema.plugin(Paginate);

const Supplier = model('supplier', supplierSchema);

export default Supplier;
