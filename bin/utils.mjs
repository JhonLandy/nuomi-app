import { execSync } from "child_process";
import fs from "fs";
import LRU from "lru-cache";
import path from "path";
import semver from "semver";

let _hasYarn;
const _yarnProjects = new LRU({
    max: 10,
    ttl: 1000,
});
let _hasGit;
const _gitProjects = new LRU({
    max: 10,
    ttl: 1000,
});

// env detection
export const hasYarn = () => {
    if (process.env.VUE_CLI_TEST) {
        return true;
    }
    if (_hasYarn != null) {
        return _hasYarn;
    }
    try {
        execSync("yarn --version", { stdio: "ignore" });
        return (_hasYarn = true);
    } catch (e) {
        return (_hasYarn = false);
    }
};

export const hasProjectYarn = cwd => {
    if (_yarnProjects.has(cwd)) {
        return checkYarn(_yarnProjects.get(cwd));
    }
    const lockFile = path.join(cwd, "yarn.lock");
    const result = fs.existsSync(lockFile);
    _yarnProjects.set(cwd, result);
    return checkYarn(result);
};

function checkYarn(result) {
    if (result && !hasYarn())
        throw new Error(`The project seems to require yarn but it's not installed.`);
    return result;
}

export const hasGit = () => {
    if (process.env.VUE_CLI_TEST) {
        return true;
    }
    if (_hasGit != null) {
        return _hasGit;
    }
    try {
        execSync("git --version", { stdio: "ignore" });
        return (_hasGit = true);
    } catch (e) {
        return (_hasGit = false);
    }
};

export const hasProjectGit = cwd => {
    if (_gitProjects.has(cwd)) {
        return _gitProjects.get(cwd);
    }

    let result;
    try {
        execSync("git status", { stdio: "ignore", cwd });
        result = true;
    } catch (e) {
        result = false;
    }
    _gitProjects.set(cwd, result);
    return result;
};

let _hasPnpm;
let _pnpmVersion;
const _pnpmProjects = new LRU({
    max: 10,
    ttl: 1000,
});

function getPnpmVersion() {
    if (_pnpmVersion != null) {
        return _pnpmVersion;
    }
    try {
        _pnpmVersion = execSync("pnpm --version", {
            stdio: ["pipe", "pipe", "ignore"],
        }).toString();
        // there's a critical bug in pnpm 2
        // https://github.com/pnpm/pnpm/issues/1678#issuecomment-469981972
        // so we only support pnpm >= 3.0.0
        _hasPnpm = true;
    } catch (e) {}
    return _pnpmVersion || "0.0.0";
}

export const hasPnpmVersionOrLater = version => {
    if (process.env.VUE_CLI_TEST) {
        return true;
    }
    return semver.gte(getPnpmVersion(), version);
};

export const hasPnpm3OrLater = () => {
    return this.hasPnpmVersionOrLater("3.0.0");
};

export const hasProjectPnpm = cwd => {
    if (_pnpmProjects.has(cwd)) {
        return checkPnpm(_pnpmProjects.get(cwd));
    }

    const lockFile = path.join(cwd, "pnpm-lock.yaml");
    const result = fs.existsSync(lockFile);
    _pnpmProjects.set(cwd, result);
    return checkPnpm(result);
};

function checkPnpm(result) {
    if (result && !hasPnpm3OrLater()) {
        throw new Error(
            `The project seems to require pnpm${_hasPnpm ? " >= 3" : ""} but it's not installed.`
        );
    }
    return result;
}

const _npmProjects = new LRU({
    max: 10,
    ttl: 1000,
});
export const hasProjectNpm = cwd => {
    if (_npmProjects.has(cwd)) {
        return _npmProjects.get(cwd);
    }

    const lockFile = path.join(cwd, "package-lock.json");
    const result = fs.existsSync(lockFile);
    _npmProjects.set(cwd, result);
    return result;
};

// OS
export const isWindows = process.platform === "win32";
export const isMacintosh = process.platform === "darwin";
export const isLinux = process.platform === "linux";
