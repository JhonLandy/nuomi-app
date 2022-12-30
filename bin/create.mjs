import chalk from "chalk"
import download from "download-git-repo"
import { execa } from "execa"
import { existsSync } from "fs"
import inquirer from "inquirer"
import path from "path"
import { hasProjectNpm, hasProjectPnpm, hasProjectYarn } from "./utils.mjs"
// @ts-check

const gitRepes = {
    webpack: "https://github.com/JhonLandy/electron-cli.git#main",
    vite: "https://github.com/JhonLandy/electron-vite.git#main"
}
function log(msg) {
    console.log(chalk.cyan(msg))
}
function error(e) {
    console.log(chalk.red(`❌ ${e}`))
}

/**
 * @param { string } project
 * @param { 'webpack' | 'vite' } value
 * @return { Promise } 
 */
function generateCode(project, value) {
    return new Promise((reolve, reject) => {
        if (existsSync(`./${project}`)) {
            reject(`已存${project}项目！`)
            return 
        }
        download(
            `direct:${gitRepes[value]}`, 
            path.join(process.cwd(), project), 
            { clone: true, }, 
            function (err) {
                if (err) {
                    reject(err)
                } else {
                    reolve()
                }
            }
        )
    })
}
/**
 * @return { Promise } 
 */
async function askQuestions() {
    const answers = await inquirer.prompt([{
        name: "ask1",
        message: chalk.blue("😀 你要包含哪种技术类型的项目?"),
        type: "list",
        prefix: "\>",
        loop: true,
        askAnswered: true,
        choices: [
            { name: "ts + webpack + electron + vue3", value: "webpack" },
            { name: "ts + vite + electron + vue3", value: "webpack" },
        ]
    },
    {
        name: "ask2",
        message: chalk.blue("😀 项目package管理器是?(推荐yarn)"),
        type: "list",
        prefix: "\>",
        loop: true,
        choices: [
            { name: "npm", value: "npm" },
            { name: "yarn", value: "yarn" },
            { name: "pnpm", value: "pnpm" },
            { name: "跳过", value: ""}
        ]
    }])
  
    return answers
}
/**
 * @param { 'yarn' | 'npm' | 'pnpm' } bin
 * @param { string [] } args
 * @param { Object } bin
 * @return { Pormise } 
 */
function execCommand(bin, args, option) {
    return new Promise((reslove, reject) => {
        const childProcess = execa(bin, args, option)
        childProcess.stdout.pipe(process.stdout)
        childProcess.stderr.pipe(process.stderr)
        childProcess.on("close", () => reslove())
        childProcess.on("error", () => reject())
    })
}
/**
 * @param { string } project
 * @param { 'yarn' | 'npm' | 'pnpm' } forceManager
 * @return { 'yarn' | 'npm' | 'pnpm' } 
 */
function getPackageManager(project, forceManager) {
    if (forceManager) {
        return forceManager
    } else {
        const porjectRoot = `${process.cwd()}/${project}`
        if (hasProjectYarn(porjectRoot)) {
            return 'yarn'
        } else if (hasProjectPnpm(porjectRoot)) {
            return 'pnpm'
        } else if (hasProjectNpm(porjectRoot)) {
            return 'npm'
        }
    }
}

/**
 * @param { string } project
 * @return { Promise } 
 */
export default async function(project) {
    try {
        const answers = await askQuestions()
        log(`🚀  Invoking generators...`)
        log(`⬇️  download from ${gitRepes[answers.ask1]} ...`)
        await generateCode(project, answers.ask1)
        log(`✔️  download completed !`)
        log(`📦  getting packageManager...`)
        const packageManager = getPackageManager(project, answers.ask2)
        log(`✔️  your project packageManager is ${chalk.yellow(packageManager)}.`)
        log(`🔨  Installing dependencies...`)
        await execCommand(packageManager, ["install"], { cwd: `./${project}`})
        log(`✔️  Installing completed !`)
        log(`🎉  Successfully created project ${chalk.yellow(project)}.`)
    } catch(e) {
        error(e)
    }
         
}
