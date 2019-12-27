import appConfig from './appConfig/index.graphql'
import user from './users/index.graphql'
import team from './team/index.graphql'
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

const schemaArray = [root,appConfig,user,team]

export default schemaArray