import path from "node:path";
import url from "node:url";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import { app, session } from "electron";

export function resolveAppPath(resource: string) {
    return url.pathToFileURL(path.join(`${app.getAppPath()}/resources/app.asar`, resource)).href;
}
export function installDevTools(devtools: Array<string>) {
    if (app.isPackaged) return;
    return Promise.all(
        devtools.map(name => {
            return session.defaultSession.loadExtension(
                path.resolve(__dirname, `../../extensions/${name}`)
            );
        })
    );
}
