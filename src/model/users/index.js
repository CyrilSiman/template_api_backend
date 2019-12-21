import mongoose from 'mongoose'

var userSchema = new mongoose.Schema({
    email: String,
    password:String,
    firstName: String,
    lastName: String,
    isAdmin: {
        type:Boolean,
        default:false,
    },
},{
    collection:'users'
})

const Users = mongoose.model('users', userSchema)

export default Users