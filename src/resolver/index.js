import _ from 'lodash'

import utils from './utils'
import emails from './email'
import teams from './team'
import tokens from './token'
import users from './user'

import appConfig from './appConfig'

const index = _.merge({
    Query: {}
    }, utils, users, appConfig, teams,emails, tokens
)

export default index