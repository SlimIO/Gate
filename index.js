"use strict";

// Require Node.js Dependencies
const { readdir, readFile } = require("fs").promises;
const { join, extname } = require("path");

// Require Third-party Dependencies
const Addon = require("@slimio/addon");

const gate = new Addon("gate");

// CONSTANTS
const CORE = global.slimio_core;
const DUMP_DIR = join(__dirname, "..", "..", "debug");

/**
 * @async
 * @function globalInfo
 * @returns {Promise<any>}
 */
async function globalInfo() {
    return {
        root: CORE.root,
        silent: CORE.silent,
        coreVersion: global.coreVersion || "0.0.0"
    };
}

/**
 * @async
 * @function listAddons
 * @returns {Promise<string[]>}
 */
async function listAddons() {
    return [...CORE.addons.keys()].map((addonName) => addonName.toLowerCase());
}

/**
 * @async
 * @function getRoutingTable
 * @returns {Promise<string[]>}
 */
async function getRoutingTable() {
    return [...CORE.routingTable.keys()];
}

/**
 * @async
 * @function getConfig
 * @param {*} header callback header
 * @param {!string} path key path in the configuration file
 * @returns {Promise<any>}
 */
async function getConfig(header, path) {
    if (typeof path === "string") {
        return CORE.config.get(path);
    }

    return CORE.config.payload;
}

/**
 * @async
 * @function setConfig
 * @param {*} header callback header
 * @param {!string} path key path in the configuration file
 * @param {!string} value key value
 * @returns {Promise<any>}
 */
async function setConfig(header, path, value) {
    CORE.config.set(path, value);
    CORE.config.lazyWriteOnDisk();
}

/**
 * @async
 * @function dumpList
 * @returns {Promise<string[]>}
 */
async function dumpList() {
    const dirents = await readdir(DUMP_DIR, { withFileTypes: true });

    return dirents.filter((row) => row.isFile() && extname(row.name) === ".json").map((row) => row.name);
}

/**
 * @async
 * @function getDump
 * @param {*} header callback header
 * @param {!string} name dump name
 * @returns {Promise<any>}
 */
async function getDump(header, name) {
    const completeName = extname(name) === ".json" ? name : `${name}.json`;
    const payload = await readFile(join(DUMP_DIR, completeName), "utf-8");

    return JSON.parse(payload);
}

gate.on("start", async() => {
    await gate.ready();
});

// Register all callbacks
gate.registerCallback(globalInfo)
    .registerCallback(listAddons)
    .registerCallback(getRoutingTable)
    .registerCallback(getConfig)
    .registerCallback(setConfig)
    .registerCallback(dumpList)
    .registerCallback(getDump);

module.exports = gate;
