import mongoose from 'mongoose'

var tokenSchema = new mongoose.Schema({
    type: String,
    expired:Date,
},{
    collection:'tokens'
})

const Tokens = mongoose.model('tokens', tokenSchema)

export default Tokens