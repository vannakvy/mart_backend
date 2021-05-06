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
    address:{
        type: Schema.Types.ObjectId,
        ref: 'Address'
    },
    tel: String,
}, {
    timestamps: true
});

supplierSchema.plugin(Paginate);

const Supplier = model('supplier', supplierSchema);

export default Supplier;