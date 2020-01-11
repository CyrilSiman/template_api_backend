import Tokens from 'ROOT/model/tokens'
import {AuthenticationError} from 'apollo-server'

const resolvers = {
    Query: {
        tokens: async (parent,args,context) => {
            if (!context.user) {
                throw new AuthenticationError('Not authenticated')
            }
            return await Teams.find().lean()
        },
    },
}

export default resolvers