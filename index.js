const Addon = require("@slimio/addon");

const agent = new Addon("agent");

// eslint-disable-next-line
async function globalInfo(header) {
    return {
        coreVersion: process.env.coreVersion
    };
}

agent.on("start", () => {

});

agent.registerCallback("global_info", globalInfo);

module.exports = agent;
