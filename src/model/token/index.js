import mongoose from 'mongoose'

var tokenSchema = new mongoose.Schema({
    type: String,
    expired:Date,
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
},{
    collection:'token'
})

const Tokens = mongoose.model('token', tokenSchema)

export default Tokens