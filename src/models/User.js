import {
    model,
    Schema
} from 'mongoose';

const roleSchema = Schema({
    role:{type: String, enum:['BASIC','ADMIN','SUPPER','ACCOUNTANT','MARTMANAGE'], default:'BASIC'},
   
})

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles:[
        roleSchema
    ]
}, {
    timestamps: true
});

const User = model('users', UserSchema);

export default User;