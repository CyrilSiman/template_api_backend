import appConfig from './appConfig/index.graphql'
import emails from './emails/index.graphql'
import users from './users/index.graphql'
import teams from './teams/index.graphql'
import tokens from './tokens/index.graphql'

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

const schemaArray = [root,
    appConfig,
    emails,
    teams,
    tokens,
    users
]

export default schemaArray