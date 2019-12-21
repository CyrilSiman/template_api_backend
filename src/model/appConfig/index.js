import mongoose from 'mongoose'

var userSchema = new mongoose.Schema({
    enabled: Boolean,
    secret: String,
},{
    collection:'appConfig'
})

const AppConfig = mongoose.model('appConfig', userSchema)

export default AppConfig