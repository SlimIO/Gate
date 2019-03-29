// Require Third-party Dependencies
const Addon = require("@slimio/addon");

const agent = new Addon("agent");

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

agent.on("start", () => {
    agent.ready();
});

agent.registerCallback("global_info", globalInfo);
agent.registerCallback("list_addons", listAddons);

module.exports = agent;
