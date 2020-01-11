import mongoose from 'mongoose'

var teamSchema = new mongoose.Schema({
    name: {
        type:String,
        unique : true,
        required : true,
        lowercase: true,
        trim: true
    },
},{
    collection:'team',
    timestamps:true
})

const Teams = mongoose.model('team', teamSchema)

export default Teams