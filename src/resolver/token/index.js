import TokensService from 'ROOT/services/TokenService'
import {AuthenticationError} from 'apollo-server'

const resolvers = {
    Query: {
        tokens: async (parent,args,context) => {
            if (!context.user) {
                throw new AuthenticationError('Not authenticated')
            }
            return await TokensService.getAll()
        },
    },
}

export default resolvers