import express from 'express'
import http from 'http'
import {ApolloServer} from 'apollo-server-express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import { Strategy } from 'passport-jwt'
import depthLimit from 'graphql-depth-limit'

import {checkIfAppIsConfigured} from 'ROOT/services/AppConfigureService'

import {DEV_ENVIRONEMENT, COOKIE_NAME} from './constants'
import resolvers from './resolver'
import {typeDefs , schemaDirectives} from './graphQL'
import mongoose from 'mongoose'
import Users from 'ROOT/model/user'
import { setCookieOrUpdate } from 'ROOT/services/utils'

const { DISABLE_CORS,
    MONGOOSE_HOST,
    MONGOOSE_DB,
    NODE_ENV,
    PORT,
    JWT_SECRET } = process.env

const whitelist = process.env.CORS.split(',')

const corsOptions = {
    origin: function(origin, callback) {
        if(DISABLE_CORS) {
            callback(null, true)
        } else {
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new Error('This Origin ' + origin + ' Not allowed by CORS'))
            }
        }
    },
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true,
    maxAge:7200,
    'methods': 'GET,POST,PUT,DELETE',
}

var cookieExtractor = function(req) {
    let token = null
    if (req && req.signedCookies) {
        token = req.signedCookies[COOKIE_NAME]
    }
    return token
}

const params = {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: cookieExtractor
}

//export const pubsub = new PubSub()

const runServer = async () => {

    await mongoose.connect(`mongodb://${MONGOOSE_HOST}/${MONGOOSE_DB}`, {useNewUrlParser: true, useUnifiedTopology: true })
    console.log(`✅ Mongo connected : ${MONGOOSE_HOST} db : ${MONGOOSE_DB}`)

    const jwtStrategy = new Strategy(params, async (payload, done) => {
        const user = await Users.findOne({_id:payload._id},{password:0}) || null
        return done(null, user)
    })

    passport.use(jwtStrategy)

    const app = express()
    app.use(cookieParser(JWT_SECRET))
    app.use(compression())
    app.disable('x-powered-by')

    app.use('/graphql', (req, res, next) => {
        passport.authenticate('jwt', { session: false }, (err, user) => {
            if (user) {
                //Extend cookie sessions
                setCookieOrUpdate(res,req.signedCookies[COOKIE_NAME])
                req.user = user
            }
            next()
        })(req, res, next)
    })

    const apolloServer = new ApolloServer({
        typeDefs,
        schemaDirectives,
        resolvers,
        debug: false,
        validationRules: [ depthLimit(10) ],
        context: ({ req,res}) => {
            return {
                res,
                user: req.user
            }
        },
        introspection: (DEV_ENVIRONEMENT === NODE_ENV),
        playground: (DEV_ENVIRONEMENT === NODE_ENV),
    })

    apolloServer.applyMiddleware({app:app, path: '/graphql',cors:corsOptions })

    const httpServer = http.createServer(app)
    apolloServer.installSubscriptionHandlers(httpServer)

    httpServer.listen(process.env.PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`)
        //console.log(`🚀 Subscriptions ready at ws://localhost:${process.env.PORT}${apolloServer.subscriptionsPath}`)
        //At startup we check if backend is correctly configured
        checkIfAppIsConfigured()
    })
}

try {
    runServer()
} catch (err) {
    console.error(err)
}
