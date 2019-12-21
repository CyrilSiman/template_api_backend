import appConfig from './appConfig/index.graphql'
import user from './user/index.graphql'
import { gql } from 'apollo-server'

const root = gql`    
    type Query {
        root: String
    }
    type Mutation {
        root: String
    }
`

const schemaArray = [root,appConfig,user]

export default schemaArray