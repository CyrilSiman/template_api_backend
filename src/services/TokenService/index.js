import Token from 'ROOT/model/token'
import {ApolloError} from 'apollo-server'
import logger from 'ROOT/services/logger'

/**
 * Get all Token
 * @return {Promise<*>}
 */
const getAll = async () => {
    try {
        return await Token.find().lean()
    } catch(err) {
        throw new ApolloError('Unknown error')
    }
}

/**
 * Check if token is still valid
 * @param tokenRef
 * @return true if token is still valid false othserwise
 */
const resetPasswordTokenStillValid = async (tokenRef) => {
    let token = await Token.findOne({ _id: tokenRef })
    let result = false
    try {
        if(token && new Date(token.expiredAt) > new Date()) {
            result = true
        }
    } catch (err) {
        logger.error(err)
    }

    return result
}

export default {
    getAll,
    resetPasswordTokenStillValid
}