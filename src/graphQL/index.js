import appConfig from './appConfig/index.graphql'
import email from './email/index.graphql'
import user from './user/index.graphql'
import team from './team/index.graphql'
import token from './token/index.graphql'

import { AuthenticationError, gql } from 'apollo-server'

import { SchemaDirectiveVisitor } from 'graphql-tools'

const root = gql`    
    type Query {
        root: String
    }
    type Mutation {
        root: String
    }
    scalar Date

    directive @isAuthenticated on FIELD_DEFINITION | OBJECT | QUERY
`


export const typeDefs = [root,
    appConfig,
    email,
    team,
    token,
    user
]

class IsAuthenticatedDirective extends SchemaDirectiveVisitor {

    // eslint-disable-next-line no-unused-vars
    visitObject(type) {
        this.ensureFieldsWrapped(type)
        type._requiredAuthRole = this.args.requires
    }

    visitFieldDefinition(field, details) {
        this.ensureFieldsWrapped(details.objectType)
        field._requiredAuthRole = this.args.requires
    }

    ensureFieldsWrapped(objectType) {
        // Mark the GraphQLObjectType object to avoid re-wrapping:
        if (objectType._authFieldsWrapped) {
            return
        }
        objectType._authFieldsWrapped = true

        const fields = objectType.getFields()

        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName]
            // eslint-disable-next-line no-undef
            const { resolve : defaultFieldResolver } = field
            field.resolve = async function (result,args,context) {

                if (!context.user) {
                    throw new AuthenticationError('Not authenticated')
                }

                return defaultFieldResolver.apply(this, args)
            }
        })
    }
}

export const schemaDirectives = {
    isAuthenticated:IsAuthenticatedDirective
}
