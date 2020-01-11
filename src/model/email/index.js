import mongoose from 'mongoose'

var mailSchema = new mongoose.Schema({
    sentTo: {
        type:String,
        required : true,
        lowercase: true,
        trim: true
    },
    sentAt: {
        type:Date,
        required:true
    },
    template : {
        id: {type:String},
        name:{type:String}
    },
    status : String,
    variables : Object,
    messageId : String
},{
    collection:'mail',
})

const Mails = mongoose.model('mail', mailSchema)

export default Mails