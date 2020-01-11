import User from 'ROOT/model/user'
import Token, { TOKEN_TYPE } from 'ROOT/model/token'
import jwt from 'jsonwebtoken'
import constants from 'ROOT/constants'
import { clearCookie, setCookieOrUpdate } from '../utils'
import logger from 'ROOT/services/logger'
import bcrypt from 'bcrypt'
import { RateLimiterMemory } from 'rate-limiter-flexible'
import { ApolloError } from 'apollo-server'
import MailerService from 'ROOT/services/MailService'
import { addHours } from 'date-fns'

const maxConsecutiveFailsByUsername = process.env.MAX_CONSECUTIVE_FAILES_BY_EMAIL

const limiterConsecutiveFailsByUsername = new RateLimiterMemory({
    points: maxConsecutiveFailsByUsername,
    duration: parseInt(process.env.BLOCK_DURATION_ANALYSIS),
    blockDuration: parseInt(process.env.BLOCK_DURATION),
})

const logout = async (context) => {
    context.res.cookie(constants.COOKIE_NAME, '', {
        domain: 'api.myapp.lc',
        httpOnly: true,
        sameSite: true,
        signed: true,
        secure: true,
        maxAge: new Date(0)
    })
    return true
}

const login = async (email, password, context) => {

    let user = await User.findOne({ email: email })
    let rlResUsername = await limiterConsecutiveFailsByUsername.get(email)

    const result = {
        authenticated: false,
        tryLeft: 0,
        retryAfter: 0,
    }

    if (rlResUsername !== null && rlResUsername.consumedPoints > maxConsecutiveFailsByUsername) {
        result.retryAfter = Math.round(rlResUsername.msBeforeNext / 1000) || 1
    } else {
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
            setCookieOrUpdate(context.res, token)
            //Reset consecutive fails
            await limiterConsecutiveFailsByUsername.delete(email)

            result.authenticated = true
        } else {
            //Clean previous cookie
            clearCookie(context.res)

            try {
                rlResUsername = await limiterConsecutiveFailsByUsername.consume(email)

                result.tryLeft = maxConsecutiveFailsByUsername - rlResUsername.consumedPoints
            } catch (rlRejected) {
                if (rlRejected instanceof Error) {
                    throw rlRejected
                } else {
                    result.retryAfter = Math.round(rlRejected.msBeforeNext / 1000) || 1
                }
            }
        }
    }

    return result
}

const sendResetPasswordLink = async (email) => {

        let user = await User.findOne({ email })

        if (user) {

            try {
                const token = new Token()
                token.type = TOKEN_TYPE.RESET
                token.expiredAt = addHours(new Date(),48)
                token.user = user._id

                let userName = ''
                if(user.firstName) {
                    userName = user.firstName
                } else {
                    userName = user.lastName
                }

                const resetLink =  process.env.LINK_ADMIN_RESET_PASSWORD.replace('{{token}}',token._id)

                await MailerService.sendTemplateEmail(MailerService.TEMPLATE.RESET_PASSWORD,email,{
                    resetLink,
                    name:userName
                })

                await token.save()
                return true
            } catch (err) {
                logger.error(err.stack)
            }
        }

        throw new ApolloError('User doesn\'t match', constants.ERROR_CODE_USER_DONT_MATCH)
}

/**
 * Update profile
 * @param user
 * @param lastName
 * @param firstName
 * @param email
 * @returns {Promise<null|*>}
 */
const updateProfile = async (user, lastName, firstName, email) => {
    try {
        let userUpdate = await User.findOne({ _id: user._id })
        if (userUpdate) {
            userUpdate.lastName = lastName
            userUpdate.firstName = firstName
            userUpdate.email = email
            await userUpdate.save()
            return userUpdate
        }
    } catch (err) {
        logger.error(err.stack)
    }
    return null
}

/**
 * Update password of connected user
 * @param user
 * @param oldPassword
 * @param newPassword
 * @returns {null|*}
 */
const updateMyPassword = async (user, oldPassword, newPassword) => {
    let userUpdate = await User.findOne({ _id: user._id })
    if (userUpdate && await bcrypt.compare(oldPassword, userUpdate.password)) {
        userUpdate.password = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_SALT_ROUNDS))
        userUpdate.save()
        return true
    } else {
        throw new ApolloError('Password doesn\'t match', constants.ERROR_CODE_PASSWORD_DONT_MATCH)
    }
}

/**
 * Reset password
 * @param tokenRef
 * @param newPassword
 * @return {Promise<void>}
 */
const resetPassword = async (tokenRef, newPassword) => {
    let token = await Token.findOne({ _id: tokenRef })

    if(token && token.user && token.expireAt < new Date()) {
        let userUpdate = await User.findOne({ _id: token.user })
        if (userUpdate) {
            userUpdate.password = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_SALT_ROUNDS))
            userUpdate.save()
            return true
        } else {
            throw new ApolloError('Password doesn\'t match', constants.ERROR_CODE_TOKEN_EXPIRED)
        }
    } else {
        throw new ApolloError('Password doesn\'t match', constants.ERROR_CODE_TOKEN_NOT_RECOGNIZED)
    }
}


export default {
    login,
    logout,
    sendResetPasswordLink,
    updateProfile,
    updateMyPassword,
    resetPassword
}