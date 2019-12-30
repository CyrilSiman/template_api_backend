import User from 'ROOT/model/users'
import jwt from 'jsonwebtoken'
import constants from 'ROOT/constants'
import { generateRandomString, setCookieOrUpdate } from '../utils'
import logger from 'ROOT/services/logger'
import bcrypt from 'bcrypt'
import { RateLimiterMemory } from 'rate-limiter-flexible'

const maxConsecutiveFailsByUsername = process.env.MAX_CONSECUTIVE_FAILES_BY_EMAIL

const limiterConsecutiveFailsByUsername = new RateLimiterMemory({
    points: maxConsecutiveFailsByUsername,
    duration: parseInt(process.env.BLOCK_DURATION_ANALYSIS),
    blockDuration: parseInt(process.env.BLOCK_DURATION),
})

const logout = async (context) => {
    context.res.cookie(constants.COOKIE_NAME,'',{
        domain:'api.myapp.lc',
        httpOnly: true,
        sameSite: true,
        signed: true,
        secure: true,
        maxAge: new Date(0)
    })
    return true
}

const login = async (email,password,context) => {

    let user = await User.findOne({email:email})
    let rlResUsername = await limiterConsecutiveFailsByUsername.get(email)

    const result = {
        authenticated:false,
        tryLeft:0,
        retryAfter:0,
    }

    if (rlResUsername !== null && rlResUsername.consumedPoints > maxConsecutiveFailsByUsername) {
        result.retryAfter = Math.round(rlResUsername.msBeforeNext / 1000) || 1
    } else {
        if(user && await bcrypt.compare(password,user.password)) {
            const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET)
            setCookieOrUpdate(context.res,token)
            //Reset consecutive fails
            await limiterConsecutiveFailsByUsername.delete(email)

            result.authenticated = true
        } else {
            //Clean previous cookie
            context.res.clearCookie(constants.COOKIE_NAME,{
                domain:process.env.COOKIE_DOMAIN_NAME,
                httpOnly: true,
                sameSite: true,
                signed: true,
                secure: true,
            })

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
    try {
        let user = await User.findOne({email})
        if(user) {
            user.resetPasswordToken = generateRandomString()
            await user.save()
        }
    } catch (err) {
        logger.error(err.stack)
    }

    return false
}

export default {
    login,
    logout,
    sendResetPasswordLink
}