import _ from 'lodash'

import utils from './utils'
import emails from './emails'
import teams from './teams'
import tokens from './tokens'
import users from './users'

import appConfig from './appConfig'

const index = _.merge({
    Query: {}
    }, utils, users, appConfig, teams,emails, tokens
)

export default index