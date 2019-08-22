"use strict";

// Require Node.js Dependencies
const { readdir, readFile, access } = require("fs").promises;
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
    const { root, silent } = CORE;
    const coreVersion = global.coreVersion || "0.0.0";

    return { root, silent, coreVersion };
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
 * @param {!Addon.CallbackHeader} header callback header
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
 * @param {!Addon.CallbackHeader} header callback header
 * @param {!string} path key path in the configuration file
 * @param {!string} value key value
 * @returns {Promise<void>}
 *
 * @throws {TypeError}
 */
async function setConfig(header, path, value) {
    if (typeof path !== "string" || typeof value !== "string") {
        throw new TypeError("path and value must be typeof string");
    }

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
    const jsonFiles = dirents
        .filter((dirent) => dirent.isFile() && extname(dirent.name) === ".json")
        .map((dirent) => dirent.name);

    return jsonFiles;
}

/**
 * @async
 * @function getDump
 * @param {!Addon.CallbackHeader} header callback header
 * @param {!string} name dump name
 * @returns {Promise<object | null>}
 *
 * @throws {TypeError}
 */
async function getDump(header, name) {
    if (typeof name !== "string") {
        throw new TypeError("name must be a string");
    }

    const completeName = extname(name) === ".json" ? name : `${name}.json`;
    try {
        const filePath = join(DUMP_DIR, completeName);

        await access(filePath);
        const str = await readFile(filePath, "utf-8");

        return JSON.parse(str);
    }
    catch (err) {
        return null;
    }
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
