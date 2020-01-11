import AppConfig from 'ROOT/model/appConfig'
import {generateRandomString} from '../utils'
import Users from 'ROOT/model/user'
import bcrypt from 'bcrypt'
import logger from 'ROOT/services/logger'

const appConfigured =  async () => {
    let config = await AppConfig.find()

    if(config) {
        config = config[0]
        return config.enabled
    }
    return false
}

const createRootUser = async (secret,email, password) => {
    try {
        let config = await AppConfig.findOne({secret:secret})
        if(config) {
            const user = new Users({
                isAdmin:true,
                lastName:'Root',
                firstName:'Root',
                email:email,
                password: await bcrypt.hash(password,parseInt(process.env.BCRYPT_SALT_ROUNDS))
            })
            await user.save()
            config.enabled = true
            config.secret = null
            await config.save()
            return true
        }
    } catch (err) {
        logger.error(err.stack)
    }
    return false
}

export const checkIfAppIsConfigured = async () => {
    let config = await AppConfig.find()

    if(config) {
        config = config[0]
    }

    if(!config || !config.enabled) {
        const secret = generateRandomString()

        const appConfig = config || new AppConfig()
        appConfig.secret = secret
        await appConfig.save()

        console.log('Your backend isn\'t configure yet, use this temporary secret to enable it, and create admin user')
        console.log(`your secret ->: ${secret}`)
    }
}

export default {
    appConfigured,
    createRootUser,
}