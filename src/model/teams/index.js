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
    collection:'teams',
    timestamps:true
})

const Teams = mongoose.model('teams', teamSchema)

export default Teams