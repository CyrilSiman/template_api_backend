import Teams from 'ROOT/model/teams'
import {AuthenticationError} from 'apollo-server'

const resolvers = {
    Query: {
        teams: async (parent,args,context) => {
            if (!context.user) {
                throw new AuthenticationError('Not authenticated')
            }
            return await Teams.find().lean()
        },
    },
}

export default resolvers