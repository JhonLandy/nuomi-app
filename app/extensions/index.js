if (process.env.NODE_ENV === "development") {
  require("electron-debug")({ showDevTools: true });
  const { session } = require("electron");
  const path = require("path");
  const devtoolPaths = [
    // 安装vue-devtools
    "./vue3-devtools",
  ];
  module.exports = async function () {
    return Promise.all(
      devtoolPaths.map(devtoolPath => {
        return session.defaultSession.loadExtension(path.join(__dirname, devtoolPath));
      })
    );
  };
} else {
  module.exports = Promise.resolve()
}

