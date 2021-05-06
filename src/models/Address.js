import {Schema,model} from 'mongoose'

const addressSchema = new Schema({
    houseNumber: String,
    drop_growed:String,
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

const Address = model("address",addressSchema)

export default Address