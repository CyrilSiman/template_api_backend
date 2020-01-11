import TeamsService from 'ROOT/services/TeamService'
import {AuthenticationError} from 'apollo-server'

const resolvers = {
    Query: {
        teams: async (parent,args,context) => {
            if (!context.user) {
                throw new AuthenticationError('Not authenticated')
            }
            return await TeamsService.getAll()
        },
    },
    Mutation: {
        createTeam: async (parent,args,context) => {
            if (!context.user || !context.user.isAdmin) {
                throw new AuthenticationError('Not authenticated')
            }
            return await TeamsService.createTeam(args.name)
        },
        deleteTeams: async (parent,args,context) => {
            if (!context.user || !context.user.isAdmin) {
                throw new AuthenticationError('Not authenticated')
            }
            return await TeamsService.deleteTeams(args.teamsId)
        },
    }
}

export default resolvers