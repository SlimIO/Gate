// Require Third-party Dependencies
const Addon = require("@slimio/addon");

const agent = new Addon("agent");

// Retrieve global core
const core = global.slimio_core;

async function globalInfo() {
    return {
        root: core.root,
        coreVersion: process.env.coreVersion
    };
}

async function listAddons() {
    return [...core.addons.keys()];
}

agent.on("start", () => {
    console.log("agent started!");
    console.log(core);
});

agent.registerCallback("global_info", globalInfo);
agent.registerCallback("list_addons", listAddons);

module.exports = agent;
