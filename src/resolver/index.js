import _ from 'lodash'

import utils from './utils'
import users from './users'
import teams from './teams'
import appConfig from './appConfig'

const index = _.merge({
    Query: {}
    }, utils, users, appConfig, teams
)

export default index