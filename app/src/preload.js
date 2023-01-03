/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const { contextBridge, ipcRenderer } = require("electron");

// Expose ipcRenderer to the client
contextBridge.exposeInMainWorld("ipcRenderer", {
    send: (...args) => ipcRenderer.send(...args),
    on: (...args) => ipcRenderer.on(...args),
    changeWindow: type => ipcRenderer.send("changeWindow", type),
});
