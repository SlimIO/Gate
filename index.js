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

// SYMBOLS
const SYM_PARALLEL = Symbol.for("ParallelAddon");

/**
 * @async
 * @function globalInfo
 * @returns {Promise<any>}
 */
async function globalInfo() {
    const { root, silent } = CORE;
    const coreVersion = global.coreVersion || "0.0.0";
    const versions = process.versions;

    return { root, silent, coreVersion, versions };
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

/**
 * @async
 * @function startAddon
 * @param {!Addon.CallbackHeader} header callback header
 * @param {!string} addonName addon to start!
 * @returns {Promise<void>}
 */
async function startAddon(header, addonName) {
    if (!CORE.addons.has(addonName)) {
        return;
    }

    const addon = CORE.addons.get(addonName);
    if (addon.started) {
        return;
    }

    await CORE.setupAddonConfiguration(addonName, { active: true, standalone: false });
}

/**
 * @async
 * @function getLockState
 * @param {!Addon.CallbackHeader} header callback header
 * @returns {Promise<object>}
 */
async function getLockState(header) {
    const currentAddon = CORE.addons.get(header.from);
    const result = {};
    for (const addonName of currentAddon.locks.keys()) {
        const localAddon = CORE.addons.get(addonName);
        const payload = { ready: false, started: false, awake: false };

        // eslint-disable-next-line
        if (Boolean(localAddon[SYM_PARALLEL])) {
            // TODO: how do we handle parallel addon ?
        }
        else {
            payload.ready = localAddon.isReady;
            payload.started = localAddon.isStarted;
            payload.awake = localAddon.isAwake;
        }

        result[addonName] = payload;
    }

    return result;
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
    .registerCallback(getDump)
    .registerCallback(startAddon)
    .registerCallback(getLockState);

module.exports = gate;
