import {Schema,model} from 'mongoose'
import Paginate from 'mongoose-paginate-v2';
const addressSchema = new Schema({
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

},{
    timestamps: true
})

addressSchema.plugin(Paginate);

const Address = model("address",addressSchema)

export default Address