import mongoose from 'mongoose'

var teamSchema = new mongoose.Schema({
    name: String,
},{
    collection:'teams',
    timestamps:true
})

const Teams = mongoose.model('teams', teamSchema)

export default Teams