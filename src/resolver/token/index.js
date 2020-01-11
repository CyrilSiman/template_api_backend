import TokensService from 'ROOT/services/TokenService'
import {AuthenticationError} from 'apollo-server'
import TokenService from 'ROOT/services/TokenService'

const resolvers = {
    Query: {
        tokens: async (parent,args,context) => {
            if (!context.user) {
                throw new AuthenticationError('Not authenticated')
            }
            return await TokensService.getAll()
        },
        resetPasswordTokenStillValid: async (parent,args) => {
            return TokenService.resetPasswordTokenStillValid(args.token)
        },
    },
}

export default resolvers