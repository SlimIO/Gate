// Require Node.js Dependencies
const { readFile } = require("fs").promises;
const { join } = require("path");

// Require Third-party Dependencies
const Addon = require("@slimio/addon");

const gate = new Addon("gate");

// Retrieve global core
const core = global.slimio_core;

async function globalInfo() {
    return {
        root: core.root,
        silent: core.silent,
        coreVersion: global.coreVersion || "0.0.0"
    };
}

async function listAddons() {
    return [...core.addons.keys()].map((addonName) => addonName.toLowerCase());
}

async function getRoutingTable() {
    return [...core.routingTable.keys()];
}

async function getConfig(header, path) {
    if (typeof path === "string") {
        return core.config.get(path);
    }

    return core.config.payload;
}

async function setConfig(header, path, value) {
    const { config } = core;
    config.set(path, value);
    config.lazyWriteOnDisk();
}


gate.on("start", async() => {
    await gate.ready();
});

gate.registerCallback("global_info", globalInfo);
gate.registerCallback("list_addons", listAddons);
gate.registerCallback("get_routing_table", getRoutingTable);

// Agent.json configuration
gate.registerCallback("get_config", getConfig);
gate.registerCallback("set_config", setConfig);

module.exports = gate;
