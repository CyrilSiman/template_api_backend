'use strict'

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
    throw err
})

// Ensure environment variables are read.
require('../config/env')

const webpack = require('webpack')

const configFactory = require('../config/webpack.config')

const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const config = configFactory('development')

build()

function build () {

    console.log('Starting server...')

    const compiler = webpack(config)
    compiler.watch({}, (err, stats) => {
        err && console.error(err)
        let messages = formatWebpackMessages(
            stats.toJson({ all: false, warnings: true, errors: true })
        )

        if (messages.errors.length) {
            messages.errors.forEach(error =>console.log(error))
        }
    })
}