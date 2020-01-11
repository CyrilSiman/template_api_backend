import Tokens from 'ROOT/model/token'
import {ApolloError} from 'apollo-server'

const getAll = async () => {
    try {
        return await Tokens.find().lean()
    } catch(err) {
        throw new ApolloError('Unknown error')
    }
}

export default {
    getAll,
}