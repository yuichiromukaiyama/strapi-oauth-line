"use strict";
module.exports = (plugin) => {
  plugin.bootstrap = require("./server/bootstrap");
  plugin.services["providers"] = require("./server/services/providers");
  return plugin;
};
