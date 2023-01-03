#!/usr/bin/env node

const chalk = require('chalk')
const electron = require('electron')
const path = require('path')
const { say } = require('cfonts')
const { spawn } = require('child_process')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const rendererConfig = require('../build/webpack.dev.config')

let electronProcess = null
let manualRestart = false

function logStats (proc, data) {
    let log = ''

    log += chalk.yellow.bold(`┏ ${proc} Process ${new Array((19 - proc.length) + 1).join('-')}`)
    log += '\n\n'

    if (typeof data === 'object') {
        data.toString({
            colors: true,
            chunks: false
        }).split(/\r?\n/).forEach(line => {
            log += '  ' + line + '\n'
        })
    } else {
        log += `  ${data}\n`
    }

    log += '\n' + chalk.yellow.bold(`┗ ${new Array(28 + 1).join('-')}`) + '\n'

    console.log(log)
}

function startRenderer () {
    return new Promise((resolve, reject) => {
        const devServerConfig = rendererConfig.devServer
        const webpackConfig = Object.assign({}, rendererConfig)
        webpackConfig.devServer = void 0
        const compiler = webpack(webpackConfig)

        compiler.hooks.done.tap('done', stats => {
            logStats('渲染', stats)
        })

        const server = new WebpackDevServer(devServerConfig, compiler)
        // server.start(devServerConfig.port)
        server.startCallback(() => resolve())
    })
}

function startElectron () {
    let args = [
        '--inspect=5858',
        path.join(__dirname, '../main.js')
    ]

    // detect yarn or npm and process commandline args accordingly
    if (process.env.npm_execpath.endsWith('yarn.js')) {
        args = args.concat(process.argv.slice(3))
    } else if (process.env.npm_execpath.endsWith('npm-cli.js')) {
        args = args.concat(process.argv.slice(2))
    }
    electronProcess = spawn(electron, args)
    electronProcess.stdout.on('data', data => {
        electronLog(data, 'blue')
    })
    electronProcess.stderr.on('data', data => {
        electronLog(data, 'red')
    })

    electronProcess.on('close', () => {
        if (!manualRestart) process.exit()
    })
}

function electronLog (data, color) {
    let log = ''
    data = data.toString().split(/\r?\n/)
    data.forEach(line => {
        log += `  ${line}\n`
    })
    if (/[0-9A-z]+/.test(log)) {
        console.log(
            chalk[color].bold('┏ Electron -------------------') +
            '\n\n' +
            log +
            chalk[color].bold('┗ ----------------------------') +
            '\n'
        )
    }
}

function greeting () {
    const cols = process.stdout.columns
    let text = ''
    if (cols > 104) text = 'electron-app'
    else if (cols > 76) text = 'electron-|app'
    else text = false

    if (text) {
        say(text, {
            colors: ['yellow'],
            font: 'simple3d',
            space: false
        })
    } else console.log(chalk.yellow.bold('\n  electron-vue'))
    console.log(chalk.blue('  getting ready...') + '\n')
}

function init () {
    greeting()

    Promise.all([startRenderer()])
        .then(() => {
            startElectron()
        })
        .catch(err => {
            console.error(err)
        })
}

init()
