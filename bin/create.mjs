import chalk from "chalk";
import download from "download-git-repo";
import { execa } from "execa";
import { existsSync } from "fs";
import inquirer from "inquirer";
import ora from "ora";
import path from "path";
import { hasProjectNpm, hasProjectPnpm, hasProjectYarn } from "./utils.mjs";
const spinner = ora({ color: "blue" });
// @ts-check
const gitRepes = {
    webpack: "https://github.com/JhonLandy/electron-cli.git#main",
    vite: "https://github.com/JhonLandy/electron-vite.git#main",
};
function log(msg) {
    console.log(chalk.cyan(msg));
}

/**
 * @description 文字一般颜色
 * @param { string } text
 * @return { string }
 */
function tc(text) {
    return chalk.cyan(text);
}
/**
 * @description 操作成功颜色
 * @param { string } text
 * @return { string }
 */
function ts(text) {
    return chalk.green(text);
}
/**
 * @description 操作失败颜色
 * @param { string } text
 * @return { string }
 */
function tf(text) {
    return chalk.red(text);
}
/**
 * @description 生成項目代碼
 * @param { string } project
 * @param { 'webpack' | 'vite' } value
 * @return { Promise }
 */
function generateCode(project, value) {
    spinner.start(tc(`⬇️  从 ${gitRepes[value]} 下载代码...`));
    return new Promise((reolve, reject) => {
        if (existsSync(`./${project}`)) {
            reject(`已存${project}项目！`);
            return;
        }
        download(
            `direct:${gitRepes[value]}`,
            path.join(process.cwd(), project),
            { clone: true },
            function (err) {
                if (err) {
                    reject(err);
                    spinner.fail(tf(`下载失败!错误${err}`));
                } else {
                    reolve();
                    spinner.succeed(ts("下载完成!"));
                }
            }
        );
    });
}
/**
 * @description 提出問題
 * @return { Promise }
 */
async function askQuestions() {
    const answers = await inquirer.prompt([
        {
            name: "ask1",
            message: tc("😀 你要包含哪种技术类型的项目?"),
            type: "list",
            prefix: ">",
            loop: true,
            askAnswered: true,
            choices: [
                { name: "ts + webpack + electron + vue3", value: "webpack" },
                { name: "ts + vite + electron + vue3", value: "webpack" },
            ],
        },
        {
            name: "ask2",
            message: chalk.blue("😀 项目package管理器是?(推荐yarn)"),
            type: "list",
            prefix: ">",
            loop: true,
            choices: [
                { name: "npm", value: "npm" },
                { name: "yarn", value: "yarn" },
                { name: "pnpm", value: "pnpm" },
                { name: "跳过", value: "" },
            ],
        },
    ]);
    return answers;
}
/**
 * @description 執行命令
 * @param { 'yarn' | 'npm' | 'pnpm' } bin
 * @param { string [] } args
 * @param { Object } bin
 * @return { Pormise }
 */
function execCommand(bin, args, option) {
    return new Promise((reslove, reject) => {
        const childProcess = execa(bin, args, option);
        childProcess.stdout.pipe(process.stdout);
        childProcess.stderr.pipe(process.stderr);
        childProcess.on("close", () => {
            reslove();
        });
        childProcess.on("error", error => {
            reject(error);
        });
    });
}
/**
 * @description 獲取項目包管理器
 * @param { string } project
 * @param { 'yarn' | 'npm' | 'pnpm' } forceManager
 * @return { 'yarn' | 'npm' | 'pnpm' }
 */
function getPackageManager(project, forceManager) {
    let bin;
    spinner.start(tc("获取当前项目包管理器..."));
    if (forceManager) {
        bin = forceManager;
    } else {
        const porjectRoot = `${process.cwd()}/${project}`;
        if (hasProjectYarn(porjectRoot)) {
            bin = "yarn";
        } else if (hasProjectPnpm(porjectRoot)) {
            bin = "pnpm";
        } else if (hasProjectNpm(porjectRoot)) {
            bin = "npm";
        }
    }
    spinner.succeed(ts(`当前项目包管理器是 ${chalk.yellow(bin)}.`));
    return bin;
}
/**
 * @description 安裝依賴
 * @param { 'yarn' | 'npm' | 'pnpm' } packageManager
 * @param { string } project
 * @return { Promise }
 */
function installDependencies(packageManager, project) {
    spinner.start(tc("安裝依赖包..."));
    return execCommand(packageManager, ["install"], { cwd: `./${project}` })
        .then(() => {
            spinner.succeed(ts("安裝完成!"));
        })
        .catch(error => {
            spinner.error(tf(`安裝失败! 错误: ${error}`));
            throw error;
        });
}
// /**
//  * @description 初始化配置（注入脚本等）
//  * @param { 'yarn' | 'npm' | 'pnpm' } packageManager
//  * @param { string } project
//  * @return { Promise }
//  */
// function postConfig(packageManager, project) {
//     spinner.start(tc("初始化配置..."));
//     return execCommand(packageManager, ["link", project], { cwd: `./${project}` })
//         .then(() => {
//             spinner.succeed(ts("配置初始化完成!"));
//         })
//         .catch(error => {
//             spinner.error(tf(`配置初始化失敗! 错误: ${error}`));
//             throw error;
//         });
// }
/**
 * @param { string } project
 * @return { Promise }
 */
export default async function (project) {
    try {
        const answers = await askQuestions();
        log(`🚀  开始生成代码...`);
        await generateCode(project, answers.ask1);
        const packageManager = getPackageManager(project, answers.ask2);
        await installDependencies(packageManager, project);
        // await postConfig(packageManager, project)
        log(`🎉  项目 ${chalk.yellow(project)} 创建成功！.`);
        console.log(
            `🏃要运行项目，请按照下面脚本执行: \n 1.cd ${project} \n 2.${packageManager} run dev `
        );
    } finally {
        spinner.clear();
    }
}
