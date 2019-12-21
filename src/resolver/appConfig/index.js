import {AuthenticationError} from 'apollo-server'
import AppConfigService from 'ROOT/services/AppConfigureService'

const resolvers = {
    Query: {
        appConfigured: () => {
            return AppConfigService.appConfigured()
        }
    },
    Mutation: {
        createRootUser : async (parent, args) => {
            try {
                return AppConfigService.createRootUser(args.secret,args.email,args.password)
            } catch (err) {
                throw new AuthenticationError('authentication failed')
            }
        },
    }
}

export default resolvers