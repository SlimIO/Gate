// Require Node.js Dependencies
const { readdir, readFile } = require("fs").promises;
const { join, extname } = require("path");

// Require Third-party Dependencies
const Addon = require("@slimio/addon");

const gate = new Addon("gate");

// CONSTANTS
const CORE = global.slimio_core;
const DUMP_DIR = join(__dirname, "..", "..", "debug");

async function globalInfo() {
    return {
        root: CORE.root,
        silent: CORE.silent,
        coreVersion: global.coreVersion || "0.0.0"
    };
}

async function listAddons() {
    return [...CORE.addons.keys()].map((addonName) => addonName.toLowerCase());
}

async function getRoutingTable() {
    return [...CORE.routingTable.keys()];
}

async function getConfig(header, path) {
    if (typeof path === "string") {
        return CORE.config.get(path);
    }

    return CORE.config.payload;
}

async function setConfig(header, path, value) {
    CORE.config.set(path, value);
    CORE.config.lazyWriteOnDisk();
}

async function dumpList() {
    const dirents = await readdir(DUMP_DIR, { withFileTypes: true });

    return dirents.filter((row) => row.isFile() && extname(row.name) === ".json").map((row) => row.name);
}

async function getDump(header, name) {
    const completeName = extname(name) === ".json" ? name : `${name}.json`;
    const payload = await readFile(join(DUMP_DIR, completeName), "utf-8");

    return JSON.parse(payload);
}

gate.on("start", async() => {
    await gate.ready();
});

gate.registerCallback("global_info", globalInfo);
gate.registerCallback("list_addons", listAddons);
gate.registerCallback("get_routing_table", getRoutingTable);
gate.registerCallback("get_config", getConfig);
gate.registerCallback("set_config", setConfig);
gate.registerCallback("dump_list", dumpList);
gate.registerCallback("get_dump", getDump);

module.exports = gate;
