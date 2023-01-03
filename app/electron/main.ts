import { BrowserWindow, app, dialog, ipcMain } from "electron";
import path from "node:path";
import { installDevTools } from "./utils";
let win: BrowserWindow;
let timeId: NodeJS.Timer | undefined;
function getCpuUsage() {
    if (winBall) {
        winBall.webContents.on("did-finish-load", () => {
            timeId = setInterval(() => {
                winBall!.webContents.send("usage", process.getCPUUsage().percentCPUUsage);
            }, 2000);
        });
    }
}
// 打开主窗口
function createWindow() {
    // 创建浏览器窗口
    win = new BrowserWindow({
        width: 900,
        height: 700,
        frame: false, //要创建无边框窗口
        type: "toolbar", //创建的窗口类型为工具栏窗口
        hasShadow: false, //不显示阴影
        transparent: true, //设置透明
        webPreferences: {
            // devTools: false, //关闭调试工具
            nodeIntegration: !!process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            preload: path.resolve(__dirname, "../src/preload.js"),
        },
    });
    // 加载应用的 index.html
    if (app.isPackaged) {
        win.loadFile("dist-app/index.html");
    } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        win.loadURL(`${process.env.VITE_DEV_SERVER_URL}/index.html`);
    }
    // 当 window 被关闭，这个事件会被触发
    win.on("closed", () => {
        // 取消引用 window 对象
        win = null;
    });
}

let winBall: BrowserWindow;
async function createSmallBallWindow() {
    // 创建浏览器窗口
    winBall = new BrowserWindow({
        width: 100,
        height: 100,
        frame: false, //要创建无边框窗口
        type: "toolbar", //创建的窗口类型为工具栏窗口
        hasShadow: false, //不显示阴影
        transparent: true, //设置透明
        webPreferences: {
            // devTools: false, //关闭调试工具
            nodeIntegration: !!process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            preload: path.resolve(__dirname, "../src/preload.js"),
        },
    });
    // 加载应用的 index.html
    if (app.isPackaged) {
        winBall.loadFile("dist-app/ball.html");
    } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        winBall.loadURL(`${process.env.VITE_DEV_SERVER_URL}/ball.html`);
    }
    getCpuUsage();

    // 当 window 被关闭，这个事件会被触发
    winBall.on("closed", () => {
        // 取消引用 window 对象
        winBall = null;
        clearInterval(timeId);
    });
}
// Electron 会在创建浏览器窗口时调用这个函数。
app.on("ready", async () => {
    try {
        await installDevTools(["vue3-devtools"]);
    } catch (e) {
        dialog.showErrorBox("发生错误", "加载devtools发生错误");
    } finally {
        createWindow();
    }
});
// 当全部窗口关闭时退出
app.on("window-all-closed", () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出
    // 否则绝大部分应用会保持激活
    if (process.platform !== "darwin") {
        app.quit();
        console.log("应用退出");
    }
});
ipcMain.on("close", () => {
    win.close();
});
ipcMain.on("changeWindow", (_, type) => {
    if (type === "small") {
        win.hide();
        createSmallBallWindow();
    } else {
        winBall.close();
        createWindow();
    }
});
