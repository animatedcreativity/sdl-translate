# sdl-translate

Text translations using SDL Language Cloud.

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

For API key:  
https://languagecloud.sdl.com/translation-toolkit/login?origin=xing&product=onlineeditor