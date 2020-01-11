import appConfig from './appConfig/index.graphql'
import users from './users/index.graphql'
import teams from './teams/index.graphql'
import emails from './emails/index.graphql'
import { gql } from 'apollo-server'

const root = gql`    
    type Query {
        root: String
    }
    type Mutation {
        root: String
    }
    scalar Date
`

const schemaArray = [root,appConfig,users,teams,emails]

export default schemaArray