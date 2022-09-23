"use strict";
module.exports = (plugin) => {
  console.log("strapi-server.js", plugin.services.toString());
  plugin.bootstrap = require("./server/bootstrap");
  plugin.services["providers"] = require("./server/services/providers");
  plugin.services["providers-registry"] = require("./server/services/providers-registry");
  return plugin;
};
