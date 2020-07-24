module.exports = {
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "Test Valuator";
      return args;
    });
  }
};
