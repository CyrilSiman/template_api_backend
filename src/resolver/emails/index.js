import User from 'ROOT/model/users'
import MailService from 'ROOT/services/MailService'
import {AuthenticationError} from 'apollo-server'

const resolvers = {
    Query: {
        emails: async (parent,args,context) => {
            if (!context.user) {
                throw new AuthenticationError('Not authenticated')
            }
            console.log(MailService.getEmails())
            return await MailService.getEmails()
        },
    },
}

export default resolvers