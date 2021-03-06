# sdl-translate

Text translations using SDL Language Cloud.  
See also: https://www.npmjs.com/package/sdl-translate-server

Can translate full HTML documents now from ^0.0.6.

### Usage

```
var sdlTranslate = require("sdl-translate");
var translate = new sdlTranslate({key: "<your_api_key_goes_here>"});
translate.languages().then(function(languages) {
  console.log(languages);
}).catch(function(error) {
  console.log(error);
});
translate.translate("This is a test line.", "eng", "swe").then(function(text) {
  console.log(text);
}).catch(function(error) {
  console.log(error);
});
```

### Usage with sdl-translate-server

```
var sdlTranslate = require("sdl-translate");
var translate = new sdlTranslate({
  server: {
    use: true,
    link: "https://<your_server_name>",
    authorization: "<your_server_authorization_key>"
  }
});
translate.languages().then(function(languages) {
  console.log(languages);
}).catch(function(error) {
  console.log(error);
});
translate.translate("This is a test line.", "eng", "swe").then(function(text) {
  console.log(text);
}).catch(function(error) {
  console.log(error);
});
```

For API key:  
https://languagecloud.sdl.com/translation-toolkit/login?origin=xing&product=onlineeditor

0.1.8: Fixed a bug not allowing to translate all text nodes for HTML content.