import User from 'ROOT/model/users'
import UserService from 'ROOT/services/UserService'
import logger from 'ROOT/services/logger'

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
                return null
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