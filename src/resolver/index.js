import _ from 'lodash'

import users from './users'
import teams from './teams'
import appConfig from './appConfig'

const index = _.merge({
    Query: {}
    }, users, appConfig, teams
)

export default index