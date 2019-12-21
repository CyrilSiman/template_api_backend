import _ from 'lodash'

import users from './users'
import appConfig from './appConfig'

const index = _.merge({
    Query: {}
    }, users, appConfig
)

export default index