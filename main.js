exports = module.exports = function(config) {
  var jsdom = require("jsdom");
  var { JSDOM } = jsdom;
  var sanitize = require("node-sanitize-options");
  config = sanitize.options(config, require("./config.js")());
  var request = require("request");
  var mod = {
    wrapper: require("node-promise-wrapper"),
    languages: function() {
      return new Promise(function(resolve, reject) {
        if (config.server.use !== true) {
          var headers = {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": "LC apiKey=" + config.key,
          };
        } else {
          var headers = {
            "Authorization": config.server.authorization,
          };
        }
        request.get({url: (config.server.use !== true ? config.link : config.server.link) + "/languages", headers: headers}, function(error, response, body) {
          if (config.server.use !== true) {
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
          } else {
            if (typeof response !== "undefined" && typeof body !== "undefined") {
              try {
                var result = JSON.parse(body);
                if (result.status === 200 && typeof result.message !== "undefined") {
                  result = JSON.parse(result.message);
                  resolve(result);
                } else {
                  reject(result);
                }
              } catch (error) {
                reject(body);
              }
            } else {
              reject(false);
            }
          }
        });
      });
    },
    translate: function(text, fromCode, toCode) {
      return new Promise(async function(resolve, reject) {
        var dom = new JSDOM(text);
        var nodes = dom.window.document.querySelectorAll("body, body *");
        // console.log(dom.window.document.documentElement.outerHTML, nodes.length);
        if (nodes.length > 1) {
          for (var i=0; i<=nodes.length-1; i++) {
            var node = nodes[i];
            for (var c=0; c<=node.childNodes.length-1; c++) {
              var childNode = node.childNodes[c];
              if (typeof childNode.tagName === "undefined") {
                if (childNode.nodeValue !== "undefined" && childNode.nodeValue.trim() !== "") {
                  var {nodeText} = await mod.wrapper("nodeText", mod.translate(childNode.nodeValue, fromCode, toCode));
                  if (typeof nodeText !== "undefined") {
                    console.log("test: ", childNode.nodeValue, nodeText, fromCode, toCode);
                    childNode.nodeValue = nodeText;
                  }
                }
              }
            }
            // if (node.children.length === 0) {
            //   console.log(node.tagName, node.innerHTML, i);
            //   var {nodeText} = await mod.wrapper("nodeText", mod.translate(node.innerHTML, fromCode, toCode));
            //   if (typeof nodeText !== "undefined") {
            //     // console.log("test: ", node.innerHTML, nodeText, fromCode, toCode);
            //     node.innerHTML = nodeText;
            //   }
            // } else {
            //   console.log(node.tagName);
            // }
          }
          resolve(dom.window.document.querySelector("body").innerHTML);
          return false;
        }
        if (config.offline.use === true) var {result} = await mod.wrapper("result", mod.db.record({text: text, from: fromCode, to: toCode}, config.offline.database));
        if (typeof result !== "undefined" && config.offline.use === true) {
          resolve(result.translation);
        } else {
          if (config.server.use !== true) {
            var headers = {
              "Accept": "application/json",
              "Content-type": "application/json",
              "Authorization": "LC apiKey=" + config.key,
            };
          } else {
            var headers = {
              "Content-type": "application/json",
              "Authorization": config.server.authorization,
            };
          }
          request.post({url: (config.server.use !== true ? config.link : config.server.link) + "/translate", body: JSON.stringify({
            text: text,
            from: fromCode,
            to: toCode
          }), headers: headers}, async function(error, response, body) {
            if (config.server.use !== true) {
              if (typeof response !== "undefined" && typeof response.headers.tr_id !== "undefined" && typeof body !== "undefined") {
                try {
                  var result = JSON.parse(body);
                  resolve(typeof result.translation !== "undefined" ? result.translation : text);
                  if (config.offline.use === true) await mod.wrapper("result", mod.db.save({text: text, from: fromCode, to: toCode, translation: (typeof result.translation !== "undefined" ? result.translation : text), time: new Date().getTime()}, config.offline.database));
                } catch (error) {
                  reject(body);
                }
              } else {
                reject(false);
              }
            } else {
              if (typeof response !== "undefined" && typeof body !== "undefined") {
                try {
                  var result = JSON.parse(body);
                  if (result.status === 200 && typeof result.message !== "undefined") {
                    resolve(result.message);
                    if (config.offline.use === true) await mod.wrapper("result", mod.db.save({text: text, from: fromCode, to: toCode, translation: result.message, time: new Date().getTime()}, config.offline.database));
                  } else {
                    reject(result);
                  }
                } catch (error) {
                  reject(body);
                }
              } else {
                reject(false);
              }
            }
          });
        }
      });
    }
  };
  mod.db = require("./db.js")(mod, config);
  return mod;
};