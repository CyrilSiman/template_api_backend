import mongoose from 'mongoose'

var mailSchema = new mongoose.Schema({
    sendTo: {
        type:String,
        required : true,
        lowercase: true,
        trim: true
    },
    sendAt: {
        type:Date,
        required:true
    },
    template : {
        id: {type:String},
        name:{type:String}
    },
    status : String,
    variables : Object,
    mailUUID : String
},{
    collection:'mails',
})

const Mails = mongoose.model('mails', mailSchema)

export default Mails