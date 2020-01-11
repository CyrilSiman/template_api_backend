import _ from 'lodash'

import utils from './utils'
import users from './users'
import teams from './teams'
import emails from './emails'
import appConfig from './appConfig'

const index = _.merge({
    Query: {}
    }, utils, users, appConfig, teams,emails
)

export default index