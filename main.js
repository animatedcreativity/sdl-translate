exports = module.exports = function(config) {
  var sanitize = require("node-sanitize-options");
  config = sanitize.options(config, require("./config.js")());
  var request = require("request");
  var mod = {
    languages: function() {
      return new Promise(function(resolve, reject) {
        request.get({url: config.link + "/languages", headers: {
          "Accept": "application/json",
          "Content-type": "application/json",
          "Authorization": "LC apiKey=" + config.key,
        }}, function(error, response, body) {
          if (typeof response !== "undefined" && typeof response.headers.tr_id !== "undefined" && typeof body !== "undefined") {
            try {
              var result = JSON.parse(body);
              resolve(result.languageExpertise.Q1);
            } catch (error) {
              reject(body);
            }
          } else {
            reject(false);
          }
        });
      });
    },
    translate: function(text, fromCode, toCode) {
      return new Promise(function(resolve, reject) {
        request.post({url: config.link + "/translate", body: JSON.stringify({
          text: text,
          from: fromCode,
          to: toCode
        }), headers: {
          "Accept": "application/json",
          "Content-type": "application/json",
          "Authorization": "LC apiKey=" + config.key,
        }}, function(error, response, body) {
          if (typeof response !== "undefined" && typeof response.headers.tr_id !== "undefined" && typeof body !== "undefined") {
            try {
              var result = JSON.parse(body);
              resolve(result);
            } catch (error) {
              reject(body);
            }
          } else {
            reject(false);
          }
        });
      });
    }
  };
  return mod;
};