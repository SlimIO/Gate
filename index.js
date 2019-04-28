// Require Third-party Dependencies
const Addon = require("@slimio/addon");

const gate = new Addon("gate");

// Retrieve global core
const core = global.slimio_core;

async function globalInfo() {
    return {
        root: core.root,
        silent: core.silent,
        coreVersion: process.env.coreVersion
    };
}

async function listAddons() {
    return [...core.addons.keys()];
}

gate.on("start", () => {
    gate.ready();
});

gate.registerCallback("global_info", globalInfo);
gate.registerCallback("list_addons", listAddons);

module.exports = gate;
