import mongoose from 'mongoose'

var userSchema = new mongoose.Schema({
    email: {
        type:String,
        required: true,
        unique:true,
        lowercase: true,
        trim: true
    },
    password:String,
    firstName: {
        type:String,
        trim: true
    },
    lastName: {
        type:String,
        trim: true
    },
    isAdmin: {
        type:Boolean,
        default:false,
    },
},{
    collection:'user'
})

const User = mongoose.model('user', userSchema)

export default User