import Teams from 'ROOT/model/team'
import {ApolloError} from 'apollo-server'
import constants from 'ROOT/constants'
import logger from 'ROOT/services/logger'

const createTeam = async (name) => {
    try {
        let team = await Teams.create({name:name})
        team.save()
        return team
    } catch(err) {
        if (err.code === constants.MONGO_ERROR_DUPLICATE) {
            throw new ApolloError('Duplicate', constants.ERROR_CODE_DUPLICATE)
        }
        logger.error(err)
        throw new ApolloError('Unknown error')
    }
}

const deleteTeams = async (teamsId) => {
    try {
        await Teams.deleteMany({_id: { $in:teamsId}})
        return teamsId
    } catch(err) {
        throw new ApolloError('Unknown error')
    }
}

const getAll = async () => {
    try {
        return await Teams.find().lean()
    } catch(err) {
        throw new ApolloError('Unknown error')
    }
}


export default {
    getAll,
    createTeam,
    deleteTeams,
}