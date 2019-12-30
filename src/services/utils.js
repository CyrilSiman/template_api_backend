import constants from 'ROOT/constants'

export const generateRandomString = () => {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
}

/**
 * Set Or update cookie with new expiration date
 * @param res
 * @param token
 */
export const setCookieOrUpdate = (res,token) => {
    res.cookie(constants.COOKIE_NAME, token, {
        domain:process.env.COOKIE_DOMAIN_NAME,
        httpOnly: true,
        sameSite: true,
        signed: true,
        secure: true,
        maxAge: parseInt(process.env.SESSION_DURATION)*60*1000
    })
}

/**
 * Clear session cookie
 * @param res
 */
export const clearCookie = (res) => {
    res.clearCookie(constants.COOKIE_NAME, {
        domain:process.env.COOKIE_DOMAIN_NAME,
        httpOnly: true,
        sameSite: true,
        signed: true,
        secure: true,
    })
}