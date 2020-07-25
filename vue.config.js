module.exports = {
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "Test Valuator";
      return args;
    });
  },
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true
    }
  }
};
