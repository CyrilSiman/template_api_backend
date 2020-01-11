import mongoose from 'mongoose'

export const TOKEN_TYPE = {
    RESET: 'RESET',
    CREATE: 'CREATE'
}

var tokenSchema = new mongoose.Schema({
    type: String,
    expiredAt:Date,
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
