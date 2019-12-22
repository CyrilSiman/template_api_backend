import User from 'ROOT/model/users'
import UserService from 'ROOT/services/UserService'
import logger from 'ROOT/services/logger'
import {AuthenticationError} from 'apollo-server'

const resolvers = {
    Query: {
        me: (parent,args,context) => {
            if (context.user) {
                return context.user
            }
            return new Error('Authentication failed')
        },
        users: async (parent,args,context) => {
            if (!context.user) {
                throw new AuthenticationError('Not authenticated')
            }
            return await User.find().lean()
        },
    },
    Mutation: {
        login : async (parent, args,context) => {
            try{
                return await UserService.login(args.email, args.password, context)
            }catch (err) {
                logger.error(err.stack)
            }
        },
        logout : async (parent, args,context) => {
            try{
                return await UserService.logout(context)
            }catch (err) {
                logger.error(err.stack)
            }
            return false
        },
        sendResetPasswordLink : async (parent, args) => {
            return await UserService.sendResetPasswordLink(args.email)
        }
    }
}

export default resolvers