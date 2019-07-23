exports = module.exports = function() {
  return {
    link: "https://lc-api.sdl.com",
    key: "", // Get an API key here: https://languagecloud.sdl.com/translation-toolkit/login?origin=xing&product=onlineeditor
    // if you want to use sdl-translate-server: https://www.npmjs.com/package/sdl-translate-server
    server: {
      use: false,
      link: "https://<your_server_name>/translate",
      authorization: "<your_server_authorization_key>", // Lowercase
    },
    offline: {
      use: false,
      database: "database",
      name: "translate"
    }
  };
};