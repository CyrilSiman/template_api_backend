import User from 'ROOT/model/user'
import UserService from 'ROOT/services/UserService'
import logger from 'ROOT/services/logger'
import {AuthenticationError} from 'apollo-server'

const resolvers = {
    Query: {
        me: (parent,args,context) => {
            if (context.user) {
                return context.user
            }
            throw new AuthenticationError('Not authenticated')
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
        },
        updateMyProfile : async (parent,args, context) => {
            if (!context.user) {
                throw new AuthenticationError('Not authenticated')
            }
            return await UserService.updateProfile(context.user,args.lastName,args.firstName,args.email)
        },
        updateMyPassword: async (parent,args, context) => {
            if (!context.user) {
                throw new AuthenticationError('Not authenticated')
            }
            return await UserService.updateMyPassword(context.user,args.oldPassword,args.newPassword)
        },
        resetPassword: async (parent,args, context) => {
            return await UserService.resetPassword(context.token,args.newPassword)
        },
    }
}

export default resolvers