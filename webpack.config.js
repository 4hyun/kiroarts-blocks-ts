const defaultConfig = require("@wordpress/scripts/config/webpack.config")
const path = require("path")

// if npm script uses --experimental-modules flag,
// defaultConfig will be an array of webpack configs
if (Array.isArray(defaultConfig)) {
  const extendedConfigArray = defaultConfig.map((config) => {
    config.resolve.alias["@/"] = path.resolve(__dirname)
    if (typeof config.entry === "function") {
      const getEntry = config.entry
      delete config.entry
      config.entry = () => ({
        ...getEntry(),
        twGlobal: "./src/global.scss",
      })
    }

    return config
  })
  module.exports = extendedConfigArray
} else {
  module.exports = {
    ...defaultConfig,
    resolve: {
      ...defaultConfig.resolve,
      alias: {
        "@/": path.resolve(__dirname), // Maps "@" to the root directory
      },
    },
  }
}
