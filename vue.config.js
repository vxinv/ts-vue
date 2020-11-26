const path = require("path");
const name = "笔记邮件";

const devServerPort = 6060;
const mockServerPort = 9528;

module.exports = {
  publicPath: '/',
  assetsDir: 'static',
  outputDir: "dist", // 输出文件目录
  lintOnSave: process.env.NODE_ENV === "development", // eslint-loader 是否在保存的时候检查
  chainWebpack: config => {
    // Provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    config.set("name", name);
  },

  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  css: {
    // css相关配置
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require("os").cpus().length > 1,
  devServer: {
    open: true,
    progress: true, // 控制台打印进度条
    port: devServerPort,
    proxy: {
      ['/api']: {
        target: `http://112.126.100.73:6060/mailnote`,
        changeOrigin: true,
        pathRewrite: {
          ['^/api']: ''
        }
      }
    }
  },
  // 第三方插件配置
  pluginOptions: {
    // style-resources-loader(https://www.npmjs.com/package/vue-cli-plugin-style-resources-loader)
    // 导入一些公共的样式文件，比如：variables / mixins / functions，避免在每个样式文件中手动的@import导入
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [
        path.resolve(__dirname, "src/styles/_variables.scss"),
        path.resolve(__dirname, "src/styles/_mixins.scss")
      ]
    }
  }
};
