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

gate.on("start", async() => {
    await gate.ready();
});

gate.registerCallback("global_info", globalInfo);
gate.registerCallback("list_addons", listAddons);
gate.registerCallback("get_routing_table", getRoutingTable);

module.exports = gate;
